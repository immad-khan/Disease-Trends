import { db } from "@/db";
import { diseases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ENVIRONMENTS } from "@/data/environments";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const [row] = await db.select().from(diseases).where(eq(diseases.slug, slug)).limit(1);
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });

  const payload = row.payload as Record<string, unknown>;
  return Response.json({
    ...payload,
    environment: ENVIRONMENTS[slug] ?? null,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    tagline: row.tagline,
    category: row.category,
    icd: row.icd,
    icon: row.icon,
    hue: row.hue,
    severity: row.severity,
  });
}
