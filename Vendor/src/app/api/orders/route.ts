import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, patients, vendors } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { genOrderCode, genPickupCode, genVendorToken } from "@/lib/helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
  const allPatients = await db.select().from(patients);
  const allVendors = await db.select().from(vendors);
  const pMap = new Map(allPatients.map((p) => [p.id, p]));
  const vMap = new Map(allVendors.map((v) => [v.id, v]));

  const enriched = await Promise.all(
    allOrders.map(async (o) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id))
        .orderBy(asc(orderItems.position));
      return {
        ...o,
        patient: pMap.get(o.patientId) ?? null,
        vendor: vMap.get(o.vendorId) ?? null,
        items,
      };
    })
  );
  return NextResponse.json({ orders: enriched });
}

type NewItem = {
  medicineName: string;
  strength?: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  instructions?: string;
  alternatives?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    patientId?: number;
    vendorId?: number;
    doctorName?: string;
    doctorId?: string;
    diagnosis?: string;
    clinicalNotes?: string;
    items?: NewItem[];
  };

  if (!body.patientId || !body.vendorId) {
    return NextResponse.json(
      { error: "Select both a patient and an approved vendor." },
      { status: 400 }
    );
  }
  const items = (body.items ?? []).filter((i) => i.medicineName?.trim());
  if (items.length === 0) {
    return NextResponse.json(
      { error: "Add at least one medicine to the prescription." },
      { status: 400 }
    );
  }

  const token = genVendorToken();
  const [order] = await db
    .insert(orders)
    .values({
      code: genOrderCode(),
      patientId: body.patientId,
      vendorId: body.vendorId,
      doctorName: body.doctorName?.trim() || "Dr. Sarah Ahmed",
      doctorId: body.doctorId?.trim() || "OGD-D-1024",
      diagnosis: body.diagnosis?.trim() || null,
      clinicalNotes: body.clinicalNotes?.trim() || null,
      vendorToken: token,
      pickupCode: genPickupCode(),
    })
    .returning();

  await db.insert(orderItems).values(
    items.map((it, idx) => ({
      orderId: order.id,
      position: idx,
      medicineName: it.medicineName.trim(),
      strength: it.strength?.trim() || null,
      dose: it.dose?.trim() || null,
      frequency: it.frequency?.trim() || null,
      duration: it.duration?.trim() || null,
      quantity: Math.max(1, Math.round(Number(it.quantity) || 1)),
      instructions: it.instructions?.trim() || null,
      alternatives: it.alternatives?.trim() || null,
    }))
  );

  return NextResponse.json({ order: { id: order.id, code: order.code, vendorToken: token } });
}
