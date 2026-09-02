import { getOrder, updateOrder, updateOrderItem } from "@/lib/jsonStore";

export type VendorPayload = {
  order: {
    id: number;
    code: string;
    patientId: number;
    vendorId: number;
    doctorName: string;
    doctorId: string;
    diagnosis: string | null;
    clinicalNotes: string | null;
    status: string;
    vendorToken: string;
    pickupCode: string;
    paymentMethod: string;
    paymentStatus: string;
    invoiceNumber: string | null;
    deliveryFee: string;
    vendorNotes: string | null;
    acknowledgedAt: string | null;
    fulfilledAt: string | null;
    collectedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  patient: {
    id: number;
    code: string;
    name: string;
    age: number | null;
    gender: string | null;
    phone: string | null;
    allergies: string | null;
  };
  vendor: {
    id: number;
    name: string;
    branch: string | null;
    city: string | null;
    authorizedPerson: string | null;
    license: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  items: {
    id: number;
    orderId: number;
    position: number;
    medicineName: string;
    strength: string | null;
    dose: string | null;
    frequency: string | null;
    duration: string | null;
    quantity: number;
    instructions: string | null;
    alternatives: string | null;
    availability: string;
    qtySupplied: number;
    substitutedName: string | null;
    unitPrice: string | null;
    discountPct: string;
    batchNumber: string | null;
    expiryDate: string | null;
    dispensed: boolean;
    vendorNote: string | null;
  }[];
};

function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function mapOrder(rawOrder: any): VendorPayload | null {
  if (!rawOrder) return null;

  const patient = rawOrder.patient ?? {};
  const vendor = rawOrder.vendor ?? {};
  const rawItems = rawOrder.items ?? [];

  const orderIdNum = stableHash(rawOrder.id);
  const vendorIdNum = stableHash(rawOrder.vendorId);
  const patientIdNum = stableHash(rawOrder.patientId);

  const items = rawItems.map((item: any, idx: number) => ({
    id: stableHash(item.id),
    orderId: orderIdNum,
    position: idx,
    medicineName: item.medicineName ?? "",
    strength: item.strength ?? null,
    dose: item.dosage ?? item.dose ?? null,
    frequency: item.frequency ?? null,
    duration: item.duration ?? null,
    quantity: item.quantity ?? 1,
    instructions: item.instructions ?? null,
    alternatives: Array.isArray(item.alternatives) ? item.alternatives.join(", ") : (item.alternatives ?? null),
    availability: item.availability ?? "pending",
    qtySupplied: item.qtySupplied ?? 0,
    substitutedName: item.substitutedName ?? null,
    unitPrice: item.unitPrice ?? null,
    discountPct: item.discountPct ?? "0",
    batchNumber: item.batchNumber ?? null,
    expiryDate: item.expiryDate ?? null,
    dispensed: item.dispensed ?? false,
    vendorNote: item.vendorNote ?? null,
  }));

  return {
    order: {
      id: orderIdNum,
      code: rawOrder.orderNo ?? rawOrder.code ?? "RX-0000",
      patientId: patientIdNum,
      vendorId: vendorIdNum,
      doctorName: rawOrder.doctorName ?? "",
      doctorId: rawOrder.doctorId ?? "",
      diagnosis: rawOrder.diagnosis ?? null,
      clinicalNotes: rawOrder.clinicalNotes ?? null,
      status: rawOrder.status ?? "sent",
      vendorToken: rawOrder.vendorAccessToken ?? rawOrder.vendorToken ?? "",
      pickupCode: rawOrder.pickupCode ?? "0000",
      paymentMethod: rawOrder.paymentMethod ?? "cash",
      paymentStatus: rawOrder.paymentStatus ?? "unpaid",
      invoiceNumber: rawOrder.invoiceNumber ?? null,
      deliveryFee: String(rawOrder.deliveryFee ?? "0"),
      vendorNotes: rawOrder.vendorNotes ?? null,
      acknowledgedAt: rawOrder.acknowledgedAt ?? null,
      fulfilledAt: rawOrder.fulfilledAt ?? null,
      collectedAt: rawOrder.collectedAt ?? null,
      createdAt: rawOrder.submittedAt ?? rawOrder.createdAt ?? new Date().toISOString(),
      updatedAt: rawOrder.updatedAt ?? new Date().toISOString(),
    },
    patient: {
      id: patientIdNum,
      code: patient.medicalRecordNo ?? patient.code ?? "MR-000",
      name: patient.fullName ?? patient.name ?? "Unknown",
      age: patient.age ?? null,
      gender: patient.gender ?? null,
      phone: patient.phone ?? null,
      allergies: Array.isArray(patient.allergies) ? patient.allergies.join(", ") : (patient.allergies ?? null),
    },
    vendor: {
      id: vendorIdNum,
      name: vendor.name ?? "",
      branch: vendor.branch ?? null,
      city: vendor.city ?? null,
      authorizedPerson: vendor.authorizedPerson ?? null,
      license: vendor.licenseNo ?? vendor.license ?? null,
      email: vendor.email ?? null,
      phone: vendor.phone ?? null,
      address: vendor.address ?? null,
    },
    items,
  };
}

export async function getVendorPayload(token: string): Promise<VendorPayload | null> {
  const rawOrder = getOrder(token);
  if (!rawOrder) return null;
  return mapOrder(rawOrder);
}

export type FulfillmentItemInput = {
  id: number;
  availability: string;
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

  const rawOrder = getOrder(token);
  if (!rawOrder) throw new Error("Order not found.");
  const rawItems: any[] = rawOrder.items ?? [];

  const itemById = new Map(current.items.map((i) => [i.id, i]));
  const rawItemByHashId = new Map(rawItems.map((ri: any) => [stableHash(ri.id), ri]));
  const now = new Date().toISOString();

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

  for (const input of normalized) {
    const rawItem = rawItemByHashId.get(input.id);
    if (!rawItem) continue;
    const dispensed = body.action === "collect" ? true : Boolean(input.dispensed);
    const patch: Record<string, unknown> = {
      availability: input.availability,
      qtySupplied: input.qtySupplied,
      substitutedName: input.substitutedName.trim() || null,
      unitPrice: input.unitPrice,
      discountPct: input.discountPct,
      batchNumber: input.batchNumber.trim() || null,
      expiryDate: input.expiryDate || null,
      dispensed,
      vendorNote: input.vendorNote.trim() || null,
    };
    updateOrderItem(rawOrder.id, rawItem.id, patch);
  }

  const orderPatch: Record<string, unknown> = {
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

  updateOrder(token, orderPatch);

  const fresh = await getVendorPayload(token);
  if (!fresh) throw new Error("Failed to reload order after update.");
  return fresh;
}
