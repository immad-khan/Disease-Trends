import { diseases1 } from "@/db/data/diseases-1";
import { diseases2 } from "@/db/data/diseases-2";
import { diseases3 } from "@/db/data/diseases-3";
import { diseases4 } from "@/db/data/diseases-4";
import { buildRegionalRows } from "@/db/data/trends";
import type { DiseaseSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const allDiseases = [...diseases1, ...diseases2, ...diseases3, ...diseases4];
  const allStats = buildRegionalRows();

  const out: DiseaseSummary[] = allDiseases.map((d) => {
    const stats = allStats.filter((s) => s.diseaseSlug === d.slug);
    
    let totalCases = 0;
    let cases2024 = 0;
    let deaths2024 = 0;
    const yearCases = new Map<number, number>();

    for (const s of stats) {
      totalCases += s.cases;
      if (s.year === 2024) {
        cases2024 += s.cases;
        deaths2024 += s.deaths;
      }
      yearCases.set(s.year, (yearCases.get(s.year) || 0) + s.cases);
    }

    let peakYear = 2024;
    let peakCases = 0;
    for (const [year, cases] of yearCases.entries()) {
      if (cases > peakCases) {
        peakCases = cases;
        peakYear = year;
      }
    }

    let peakRegion = "—";
    let peakRegionCases = 0;
    const peakYearStats = stats.filter((s) => s.year === peakYear);
    for (const s of peakYearStats) {
      if (s.cases > peakRegionCases) {
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
      icon: d.icon,
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
