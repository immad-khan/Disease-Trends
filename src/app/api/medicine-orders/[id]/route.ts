import { db } from "@/db";
import { medicineOrderItems, medicineOrders, medicineVendors, patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [order] = await db.select().from(medicineOrders).where(eq(medicineOrders.id, id)).limit(1);
  if (!order) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  const [[patient], [vendor], items] = await Promise.all([
    db.select().from(patients).where(eq(patients.id, order.patientId)).limit(1),
    db.select().from(medicineVendors).where(eq(medicineVendors.id, order.vendorId)).limit(1),
    db.select().from(medicineOrderItems).where(eq(medicineOrderItems.orderId, id)),
  ]);
  return Response.json({ ok: true, order, patient, vendor, items });
}
