import { NextResponse } from "next/server";
import { db } from "@/db";
import { vendors } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Vendor name is required." }, { status: 400 });
  }
  const [created] = await db
    .insert(vendors)
    .values({
      name,
      branch: String(body.branch ?? "").trim() || null,
      city: String(body.city ?? "").trim() || null,
      authorizedPerson: String(body.authorizedPerson ?? "").trim() || null,
      license: String(body.license ?? "").trim() || null,
      email: String(body.email ?? "").trim() || null,
      phone: String(body.phone ?? "").trim() || null,
      address: String(body.address ?? "").trim() || null,
    })
    .returning();
  return NextResponse.json({ vendor: created });
}
