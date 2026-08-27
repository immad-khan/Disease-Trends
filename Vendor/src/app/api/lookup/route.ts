import { NextResponse } from "next/server";
import { getVendors, getPatients } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const vendorList = getVendors().map((v: any, idx: number) => ({
    id: idx + 1,
    name: v.name,
    branch: v.branch ?? null,
    city: v.city ?? null,
    authorizedPerson: v.authorizedPerson ?? null,
    license: v.licenseNo ?? v.license ?? null,
    email: v.email ?? null,
    phone: v.phone ?? null,
    address: v.address ?? null,
  }));
  const patientList = getPatients().map((p: any, idx: number) => ({
    id: idx + 1,
    code: p.medicalRecordNo ?? p.code ?? `PT-${idx + 1}`,
    name: p.fullName ?? p.name ?? "Unknown",
    age: p.age ?? null,
    gender: p.gender ?? null,
    phone: p.phone ?? null,
    allergies: Array.isArray(p.allergies) ? p.allergies.join(", ") : (p.allergies ?? null),
  }));
  return NextResponse.json({ patients: patientList, vendors: vendorList });
}
