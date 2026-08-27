import { NextResponse } from "next/server";
import { getOrders } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function GET() {
  const orders = getOrders().map((o: any) => {
    const patient = o.patient ?? {};
    const vendor = o.vendor ?? {};
    const rawItems = o.items ?? [];
    const orderIdNum = stableHash(o.id);

    return {
      id: orderIdNum,
      code: o.orderNo ?? o.code ?? "RX-0000",
      doctorName: o.doctorName ?? "",
      doctorId: o.doctorId ?? "",
      diagnosis: o.diagnosis ?? null,
      clinicalNotes: o.clinicalNotes ?? null,
      status: o.status ?? "sent",
      createdAt: o.submittedAt ?? o.createdAt ?? new Date().toISOString(),
      patient: {
        id: stableHash(o.patientId ?? "unknown"),
        code: patient.medicalRecordNo ?? patient.code ?? "MR-000",
        name: patient.fullName ?? patient.name ?? "Unknown",
      },
      vendor: {
        id: stableHash(o.vendorId ?? "unknown"),
        name: vendor.name ?? "Unknown",
        branch: vendor.branch ?? null,
        city: vendor.city ?? null,
      },
      items: rawItems.map((i: any) => ({
        id: stableHash(i.id),
        medicineName: i.medicineName ?? "",
        strength: i.strength ?? null,
        quantity: i.quantity ?? 1,
        availability: i.availability ?? "pending",
      })),
    };
  });

  return NextResponse.json({ orders });
}
