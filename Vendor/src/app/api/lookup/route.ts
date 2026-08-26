import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { patients, vendors } from "@/db/schema";
import { ensureSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const [patientList, vendorList] = await Promise.all([
    db.select().from(patients).orderBy(asc(patients.name)),
    db.select().from(vendors).orderBy(asc(vendors.name)),
  ]);
  return NextResponse.json({ patients: patientList, vendors: vendorList });
}
