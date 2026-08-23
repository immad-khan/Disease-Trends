import { diseases1 } from "@/db/data/diseases-1";
import { diseases2 } from "@/db/data/diseases-2";
import { diseases3 } from "@/db/data/diseases-3";
import { diseases4 } from "@/db/data/diseases-4";
import { buildRegionalRows } from "@/db/data/trends";
import type { DiseaseSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const allDiseases = [...diseases1, ...diseases2, ...diseases3, ...diseases4];
  const regionalStats = buildRegionalRows();

  const out: DiseaseSummary[] = allDiseases.map((d) => {
    const stats = regionalStats.filter((s) => s.diseaseSlug === d.slug);
    
    let cases2024 = 0;
    let deaths2024 = 0;
    let totalCases = 0;
    const yearPeaks = new Map<number, number>();

    for (const s of stats) {
      if (s.year === 2024) {
        cases2024 += s.cases;
        deaths2024 += s.deaths;
      }
      totalCases += s.cases;
      yearPeaks.set(s.year, (yearPeaks.get(s.year) || 0) + s.cases);
    }
    
    let peakYear = 2024;
    let peakCases = 0;
    for (const [y, c] of yearPeaks.entries()) {
      if (c > peakCases) {
        peakCases = c;
        peakYear = y;
      }
    }

    let peakRegion = "—";
    let peakRegionCases = 0;
    for (const s of stats) {
      if (s.year === peakYear && s.cases > peakRegionCases) {
        peakRegionCases = s.cases;
        peakRegion = s.regionName;
      }
    }

    return {
      slug: d.slug,
      name: d.name,
      shortName: d.shortName,
      tagline: d.tagline,
      category: d.category,
      icd: d.icd,
      icon: d.icon as any,
      hue: d.hue,
      severity: d.severity,
      cases2024,
      deaths2024,
      totalCases,
      peakYear,
      peakCases,
      peakRegion,
      peakRegionCases,
    };
  });

  out.sort((a, b) => b.severity - a.severity);
  return Response.json(out);
}
