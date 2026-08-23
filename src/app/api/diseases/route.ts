import { db } from "@/db";
import { diseases, regionalStats } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import type { DiseaseSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select({
      slug: diseases.slug,
      name: diseases.name,
      shortName: diseases.shortName,
      tagline: diseases.tagline,
      category: diseases.category,
      icd: diseases.icd,
      icon: diseases.icon,
      hue: diseases.hue,
      severity: diseases.severity,
      totalCases: sql<number>`coalesce(sum(${regionalStats.cases}), 0)`,
      cases2024: sql<number>`coalesce(sum(${regionalStats.cases}) filter (where ${regionalStats.year} = 2024), 0)`,
      deaths2024: sql<number>`coalesce(sum(${regionalStats.deaths}) filter (where ${regionalStats.year} = 2024), 0)`,
    })
    .from(diseases)
    .leftJoin(regionalStats, eq(regionalStats.diseaseSlug, diseases.slug))
    .groupBy(diseases.slug);

  // compute peak year per disease
  const peaks = await db
    .select({
      slug: regionalStats.diseaseSlug,
      year: regionalStats.year,
      cases: sql<number>`sum(${regionalStats.cases})`,
    })
    .from(regionalStats)
    .groupBy(regionalStats.diseaseSlug, regionalStats.year);

  const peakMap = new Map<string, { year: number; cases: number }>();
  for (const p of peaks) {
    const cur = peakMap.get(p.slug);
    if (!cur || p.cases > cur.cases) peakMap.set(p.slug, { year: p.year, cases: Number(p.cases) });
  }

  // top region within each disease's peak year
  const regionPeaks = await db
    .select({
      slug: regionalStats.diseaseSlug,
      year: regionalStats.year,
      regionName: regionalStats.regionName,
      cases: regionalStats.cases,
    })
    .from(regionalStats);

  const peakRegionMap = new Map<string, { region: string; cases: number }>();
  for (const r of regionPeaks) {
    const pk = peakMap.get(r.slug);
    if (!pk || r.year !== pk.year) continue;
    const cur = peakRegionMap.get(r.slug);
    if (!cur || r.cases > cur.cases) peakRegionMap.set(r.slug, { region: r.regionName, cases: r.cases });
  }

  const out: DiseaseSummary[] = rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    shortName: r.shortName,
    tagline: r.tagline,
    category: r.category,
    icd: r.icd,
    icon: r.icon,
    hue: r.hue,
    severity: r.severity,
    cases2024: Number(r.cases2024),
    deaths2024: Number(r.deaths2024),
    totalCases: Number(r.totalCases),
    peakYear: peakMap.get(r.slug)?.year ?? 2024,
    peakCases: peakMap.get(r.slug)?.cases ?? 0,
    peakRegion: peakRegionMap.get(r.slug)?.region ?? "—",
    peakRegionCases: peakRegionMap.get(r.slug)?.cases ?? 0,
  }));

  out.sort((a, b) => b.severity - a.severity);
  return Response.json(out);
}
