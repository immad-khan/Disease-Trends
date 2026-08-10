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
  const disease = allDiseases.find((d) => d.slug === slug);
  
  if (!disease) return Response.json({ error: "not_found" }, { status: 404 });

  return Response.json({
    ...disease,
    environment: ENVIRONMENTS[slug] ?? null,
  });
}
