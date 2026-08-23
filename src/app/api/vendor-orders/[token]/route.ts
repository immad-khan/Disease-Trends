import { db } from "@/db";
import { medicineOrderItems, medicineOrders, medicineVendors, patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendMail, smtpConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

async function getBundle(token: string) {
  const [order] = await db.select().from(medicineOrders).where(eq(medicineOrders.vendorAccessToken, token)).limit(1);
  if (!order) return null;
  const [[patient], [vendor], items] = await Promise.all([
    db.select().from(patients).where(eq(patients.id, order.patientId)).limit(1),
    db.select().from(medicineVendors).where(eq(medicineVendors.id, order.vendorId)).limit(1),
    db.select().from(medicineOrderItems).where(eq(medicineOrderItems.orderId, order.id)),
  ]);
  return { order, patient, vendor, items };
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const bundle = await getBundle(token);
  if (!bundle) return Response.json({ ok: false, error: "Invalid or expired vendor link." }, { status: 404 });
  return Response.json({ ok: true, ...bundle });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const bundle = await getBundle(token);
  if (!bundle) return Response.json({ ok: false, error: "Invalid or expired vendor link." }, { status: 404 });

  const body = (await req.json()) as {
    billReference?: string;
    billAmountPaisa?: number;
    billDocumentUrl?: string;
    vendorNote?: string;
    items: {
      id: string;
      availability: "available" | "alternative_available" | "unavailable";
      suppliedMedicine?: string;
      suppliedQuantity?: number;
      unitPricePaisa?: number;
      vendorItemNote?: string;
    }[];
  };

  if (!Array.isArray(body.items) || body.items.length !== bundle.items.length) {
    return Response.json({ ok: false, error: "Please respond to every medicine item." }, { status: 400 });
  }

  const allowed = new Set(bundle.items.map((i) => i.id));
  for (const item of body.items) {
    if (!allowed.has(item.id)) return Response.json({ ok: false, error: "Invalid order item." }, { status: 400 });
    if (!["available", "alternative_available", "unavailable"].includes(item.availability)) {
      return Response.json({ ok: false, error: "Invalid availability state." }, { status: 400 });
    }
    await db
      .update(medicineOrderItems)
      .set({
        availability: item.availability,
        suppliedMedicine: item.suppliedMedicine || null,
        suppliedQuantity: item.suppliedQuantity ?? 0,
        unitPricePaisa: item.unitPricePaisa ?? null,
        vendorItemNote: item.vendorItemNote || null,
      })
      .where(eq(medicineOrderItems.id, item.id));
  }

  const states = body.items.map((i) => i.availability);
  const status = states.every((s) => s !== "unavailable")
    ? "fulfilled"
    : states.every((s) => s === "unavailable")
      ? "unavailable"
      : "partially_available";

  await db
    .update(medicineOrders)
    .set({
      status,
      billReference: body.billReference || null,
      billAmountPaisa: body.billAmountPaisa ?? null,
      billDocumentUrl: body.billDocumentUrl || null,
      vendorNote: body.vendorNote || null,
      respondedAt: new Date(),
    })
    .where(eq(medicineOrders.id, bundle.order.id));

  if (smtpConfigured()) {
    const available = body.items.filter((i) => i.availability !== "unavailable").length;
    const unavailable = body.items.length - available;
    const total = body.billAmountPaisa != null ? `PKR ${(body.billAmountPaisa / 100).toLocaleString("en-PK")}` : "pending";
    await sendMail({
      to: bundle.patient.email,
      subject: `${bundle.vendor.name} responded to order ${bundle.order.orderNo}`,
      text: `${available} medicines available, ${unavailable} unavailable. Bill: ${total}. Contact ${bundle.vendor.authorizedPerson} at ${bundle.vendor.phone}.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:20px;background:#f6fbfc;border-radius:14px"><h2 style="color:#0b2c3a">Vendor response received</h2><p>${available} medicine(s) available · ${unavailable} unavailable</p><p><b>Bill:</b> ${total}<br><b>Invoice:</b> ${body.billReference || "—"}</p><div style="background:white;border:1px solid #d6f4f9;padding:14px;border-radius:10px"><b>${bundle.vendor.name} — ${bundle.vendor.branch}</b><br>${bundle.vendor.authorizedPerson}<br>${bundle.vendor.phone}<br>${bundle.vendor.address}</div></div>`,
    });
  }

  return Response.json({ ok: true, status });
}
