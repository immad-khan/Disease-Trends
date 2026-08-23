import { diseases1 } from "@/db/data/diseases-1";
import { diseases2 } from "@/db/data/diseases-2";
import { diseases3 } from "@/db/data/diseases-3";
import { diseases4 } from "@/db/data/diseases-4";
import { ENVIRONMENTS } from "@/data/environments";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const allDiseases = [...diseases1, ...diseases2, ...diseases3, ...diseases4];
  const row = allDiseases.find(d => d.slug === slug);
  
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });

  const { severity, ...payload } = row;
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
    severity,
  });
}
