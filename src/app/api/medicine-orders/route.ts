import { getOrders, addOrder } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

function orderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `RX-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.patientId || !body.vendorId || !body.doctorName || !body.doctorId) {
      return Response.json({ ok: false, error: "Patient, vendor, doctor name and doctor ID are required." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || !body.items.length) {
      return Response.json({ ok: false, error: "At least one medicine is required." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const token = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
    const orderNo = orderNumber();

    const newOrder = {
      id,
      orderNo,
      patientId: body.patientId,
      vendorId: body.vendorId,
      doctorName: body.doctorName,
      doctorId: body.doctorId,
      diagnosis: body.diagnosis || null,
      clinicalNotes: body.clinicalNotes || null,
      vendorAccessToken: token,
      status: "sent",
      vendorEmailStatus: "queued_no_smtp",
      patientEmailStatus: "queued_no_smtp",
      submittedAt: new Date(),
      items: body.items.map((i: any) => ({
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
      })),
      patient: { medicalRecordNo: "MR-001", fullName: "Ahmad Khan" }, // mock enrichment
      vendor: { name: "Al-Shifa Pharmacy", branch: "Main Branch", authorizedPerson: "Dr. Usman", phone: "042-31112222", address: "123 Health Ave", mapsUrl: "" }
    };
    
    addOrder(newOrder);

    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const origin = process.env.APP_URL || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin);
    const responseUrl = `${origin.replace(/\/$/, "")}/vendor/orders/${token}`;

    return Response.json({
      ok: true,
      orderId: id,
      orderNo,
      responseUrl,
      smtpConfigured: false,
      vendor: newOrder.vendor,
    });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Order failed." }, { status: 500 });
  }
}

export async function GET() {
  const orders = getOrders();
  return Response.json({ orders, smtpConfigured: false });
}
