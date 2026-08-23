import { db } from "@/db";
import { regionalStats } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const disease = searchParams.get("disease");
  if (!disease) return Response.json({ error: "disease param required" }, { status: 400 });

  const rows = await db
    .select()
    .from(regionalStats)
    .where(eq(regionalStats.diseaseSlug, disease))
    .orderBy(asc(regionalStats.year));

  return Response.json(rows);
}
