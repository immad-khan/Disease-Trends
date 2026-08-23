import { db } from "@/db";
import {
  medicineOrderItems,
  medicineOrders,
  medicineVendors,
  patients,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { patientVendorEmail, sendMail, smtpConfigured, vendorOrderEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

interface IncomingItem {
  medicineName: string;
  matchedSlug?: string | null;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: number;
  alternatives?: string[];
}

function orderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `RX-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      patientId: string;
      vendorId: string;
      doctorName: string;
      doctorId: string;
      diagnosis?: string;
      clinicalNotes?: string;
      items: IncomingItem[];
    };

    if (!body.patientId || !body.vendorId || !body.doctorName || !body.doctorId) {
      return Response.json({ ok: false, error: "Patient, vendor, doctor name and doctor ID are required." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || !body.items.length) {
      return Response.json({ ok: false, error: "At least one medicine is required." }, { status: 400 });
    }

    const [[patient], [vendor]] = await Promise.all([
      db.select().from(patients).where(eq(patients.id, body.patientId)).limit(1),
      db.select().from(medicineVendors).where(eq(medicineVendors.id, body.vendorId)).limit(1),
    ]);
    if (!patient) return Response.json({ ok: false, error: "Patient not found." }, { status: 404 });
    if (!vendor) return Response.json({ ok: false, error: "Vendor not found." }, { status: 404 });

    const id = crypto.randomUUID();
    const token = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
    const orderNo = orderNumber();

    await db.insert(medicineOrders).values({
      id,
      orderNo,
      patientId: patient.id,
      vendorId: vendor.id,
      doctorName: body.doctorName,
      doctorId: body.doctorId,
      diagnosis: body.diagnosis || null,
      clinicalNotes: body.clinicalNotes || null,
      vendorAccessToken: token,
      status: "sent",
      vendorEmailStatus: smtpConfigured() ? "sending" : "queued_no_smtp",
      patientEmailStatus: smtpConfigured() ? "sending" : "queued_no_smtp",
    });

    const itemRows = body.items.map((i) => ({
      id: crypto.randomUUID(),
      orderId: id,
      medicineName: i.medicineName,
      matchedSlug: i.matchedSlug || null,
      strength: i.strength,
      dosage: i.dosage,
      frequency: i.frequency,
      duration: i.duration,
      instructions: i.instructions || null,
      quantity: Math.max(1, Number(i.quantity) || 1),
      alternatives: i.alternatives ?? [],
      availability: "pending",
    }));
    await db.insert(medicineOrderItems).values(itemRows);

    const [order] = await db.select().from(medicineOrders).where(eq(medicineOrders.id, id)).limit(1);
    const persistedItems = await db.select().from(medicineOrderItems).where(eq(medicineOrderItems.orderId, id));
    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const origin = process.env.APP_URL || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin);
    const responseUrl = `${origin.replace(/\/$/, "")}/vendor/orders/${token}`;

    if (smtpConfigured()) {
      const vendorMail = vendorOrderEmail({ order, patient, vendor, items: persistedItems, responseUrl });
      const patientMail = patientVendorEmail({ order, patient, vendor, items: persistedItems });
      const [vr, pr] = await Promise.all([
        sendMail({ to: vendor.email, ...vendorMail }),
        sendMail({ to: patient.email, ...patientMail }),
      ]);
      await db
        .update(medicineOrders)
        .set({
          vendorEmailStatus: vr.ok ? "sent" : `failed:${vr.reason}`,
          patientEmailStatus: pr.ok ? "sent" : `failed:${pr.reason}`,
        })
        .where(eq(medicineOrders.id, id));
    }

    return Response.json({
      ok: true,
      orderId: id,
      orderNo,
      responseUrl,
      smtpConfigured: smtpConfigured(),
      vendor: {
        name: vendor.name,
        branch: vendor.branch,
        authorizedPerson: vendor.authorizedPerson,
        phone: vendor.phone,
        address: vendor.address,
        mapsUrl: vendor.mapsUrl,
      },
    });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Order failed." }, { status: 500 });
  }
}

export async function GET() {
  const orders = await db.select().from(medicineOrders).orderBy(desc(medicineOrders.submittedAt)).limit(100);
  const enriched = await Promise.all(
    orders.map(async (order) => {
      const [[patient], [vendor], items] = await Promise.all([
        db.select().from(patients).where(eq(patients.id, order.patientId)).limit(1),
        db.select().from(medicineVendors).where(eq(medicineVendors.id, order.vendorId)).limit(1),
        db.select().from(medicineOrderItems).where(eq(medicineOrderItems.orderId, order.id)),
      ]);
      return { ...order, patient, vendor, items };
    })
  );
  return Response.json({ orders: enriched, smtpConfigured: smtpConfigured() });
}
