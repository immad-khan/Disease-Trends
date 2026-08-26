import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await db.execute(sql`select 1`);
  // Best-effort demo seed; never blocks health.
  await ensureSeed();
  return NextResponse.json({ ok: true, service: "ogdcl-3d-atlas-medicine-orders" });
}
