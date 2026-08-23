import { buildRegionalRows } from "@/db/data/trends";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const disease = searchParams.get("disease");
  if (!disease) return Response.json({ error: "disease param required" }, { status: 400 });

  const allStats = buildRegionalRows();
  const rows = allStats
    .filter(s => s.diseaseSlug === disease)
    .sort((a, b) => a.year - b.year);

  return Response.json(rows);
}
