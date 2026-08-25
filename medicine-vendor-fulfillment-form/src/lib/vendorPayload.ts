import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, patients, vendors } from "@/db/schema";
import type { Availability } from "@/lib/helpers";

export type VendorPayload = {
  order: typeof orders.$inferSelect;
  patient: typeof patients.$inferSelect;
  vendor: typeof vendors.$inferSelect;
  items: (typeof orderItems.$inferSelect)[];
};

export async function getVendorPayload(token: string): Promise<VendorPayload | null> {
  const [order] = await db.select().from(orders).where(eq(orders.vendorToken, token)).limit(1);
  if (!order) return null;
  const [patient] = await db
    .select()
    .from(patients)
    .where(eq(patients.id, order.patientId))
    .limit(1);
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, order.vendorId))
    .limit(1);
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.position);
  if (!patient || !vendor) return null;
  return { order, patient, vendor, items };
}

export type FulfillmentItemInput = {
  id: number;
  availability: Availability;
  qtySupplied: number;
  substitutedName: string;
  unitPrice: string;
  discountPct: string;
  batchNumber: string;
  expiryDate: string;
  dispensed: boolean;
  vendorNote: string;
};

export type FulfillmentBody = {
  action: "acknowledge" | "save" | "finalize" | "collect";
  pickupCode?: string;
  order: {
    deliveryFee: string;
    paymentMethod: string;
    paymentStatus: string;
    vendorNotes: string;
  };
  items: FulfillmentItemInput[];
};

export async function applyFulfillment(
  token: string,
  body: FulfillmentBody
): Promise<VendorPayload> {
  const current = await getVendorPayload(token);
  if (!current) throw new Error("Order not found for this fulfillment link.");
  const { order } = current;

  const itemById = new Map(current.items.map((i) => [i.id, i]));
  const now = new Date();

  // Validate + normalize items
  const normalized: FulfillmentItemInput[] = body.items.map((input) => {
    const existing = itemById.get(input.id);
    if (!existing) throw new Error("Unknown line item in payload.");
    const prescribed = existing.quantity || 1;
    let qty = Math.max(0, Math.round(Number(input.qtySupplied) || 0));
    const price = Math.max(0, parseFloat(input.unitPrice) || 0);
    const discount = Math.min(100, Math.max(0, parseFloat(input.discountPct) || 0));

    if (body.action === "finalize") {
      if (input.availability === "pending")
        throw new Error(`Mark stock status for ${existing.medicineName} before issuing the invoice.`);
      if (input.availability === "in_stock") qty = prescribed;
      if (input.availability === "out_of_stock") qty = 0;
      if (input.availability === "partial") {
        if (qty <= 0)
          throw new Error(`Enter the supplied quantity for ${existing.medicineName} (partial stock).`);
        qty = Math.min(qty, prescribed);
      }
      if (input.availability === "substituted") {
        if (!input.substitutedName.trim())
          throw new Error(`Name the substitute medicine for ${existing.medicineName}.`);
        if (qty <= 0) qty = prescribed;
      }
      if (input.availability !== "out_of_stock" && price <= 0)
        throw new Error(`Enter the unit price for ${existing.medicineName}.`);
    } else {
      if (input.availability === "in_stock" && qty <= 0) qty = prescribed;
      if (input.availability === "out_of_stock") qty = 0;
      qty = Math.min(qty, prescribed || qty);
    }

    return { ...input, qtySupplied: qty, unitPrice: String(price), discountPct: String(discount) };
  });

  if (body.action === "collect") {
    if (order.status !== "fulfilled")
      throw new Error("Finalize the invoice before confirming patient pickup.");
    if (!body.pickupCode || body.pickupCode.trim() !== order.pickupCode)
      throw new Error("Pickup code does not match the code shared with the patient.");
  }

  // Persist items
  for (const input of normalized) {
    const existing = itemById.get(input.id)!;
    const dispensed =
      body.action === "collect" ? true : Boolean(input.dispensed);
    await db
      .update(orderItems)
      .set({
        availability: input.availability,
        qtySupplied: input.qtySupplied,
        substitutedName: input.substitutedName.trim() || null,
        unitPrice: input.unitPrice,
        discountPct: input.discountPct,
        batchNumber: input.batchNumber.trim() || null,
        expiryDate: input.expiryDate || null,
        dispensed,
        dispensedAt: dispensed ? existing.dispensedAt ?? now : null,
        vendorNote: input.vendorNote.trim() || null,
      })
      .where(eq(orderItems.id, input.id));
  }

  // Order-level updates
  const orderPatch: Partial<typeof orders.$inferInsert> = {
    deliveryFee: String(Math.max(0, parseFloat(body.order.deliveryFee) || 0)),
    paymentMethod: body.order.paymentMethod,
    paymentStatus: body.order.paymentStatus,
    vendorNotes: body.order.vendorNotes.trim() || null,
    updatedAt: now,
  };
  if (body.action === "acknowledge" && order.status === "sent") {
    orderPatch.status = "acknowledged";
    orderPatch.acknowledgedAt = now;
  }
  if (body.action === "finalize") {
    orderPatch.status = "fulfilled";
    orderPatch.paymentStatus = "submitted";
    orderPatch.fulfilledAt = now;
    orderPatch.acknowledgedAt = order.acknowledgedAt ?? now;
    orderPatch.invoiceNumber = `INV-${order.code.replace(/\D/g, "")}`;
  }
  if (body.action === "collect") {
    orderPatch.status = "collected";
    orderPatch.collectedAt = now;
  }

  await db.update(orders).set(orderPatch).where(eq(orders.id, order.id));

  const fresh = await getVendorPayload(token);
  if (!fresh) throw new Error("Failed to reload order after update.");
  return fresh;
}
