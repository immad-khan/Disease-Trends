import { NextResponse } from "next/server";
import { getVendors } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const vendorList = getVendors();
  return NextResponse.json({ vendors: vendorList });
}
