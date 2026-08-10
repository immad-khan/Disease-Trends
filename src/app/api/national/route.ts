import { db } from "@/db";
import { regionalStats } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select({
      disease: regionalStats.diseaseSlug,
      year: regionalStats.year,
      cases: sql<number>`sum(${regionalStats.cases})::int`,
      deaths: sql<number>`sum(${regionalStats.deaths})::int`,
    })
    .from(regionalStats)
    .groupBy(regionalStats.diseaseSlug, regionalStats.year)
    .orderBy(regionalStats.year);

  // yearly leader
  const byYear = new Map<number, typeof rows>();
  for (const r of rows) {
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year)!.push(r);
  }

  const leaders = Array.from(byYear.entries()).map(([year, list]) => {
    const sorted = [...list].sort((a, b) => b.cases - a.cases);
    return {
      year,
      leader: sorted[0]?.disease ?? null,
      leaderCases: sorted[0]?.cases ?? 0,
      ranking: sorted.map((s) => ({ disease: s.disease, cases: Number(s.cases) })),
    };
  });

  return Response.json({ matrix: rows, leaders });
}
