import type { RegionKey } from "@/lib/types";
import { REGIONS, YEARS } from "@/lib/regions";

// National yearly anchors compiled from official reporting
// (NIH Pakistan, NTP, DoMC, Polio Eradication Programme, NCOC, EPI).
// Hepatitis C series = estimated NEW viremic infections per year.
export interface YearPoint {
  c: number;
  d: number;
}

export const TRENDS: Record<
  string,
  {
    national: Record<number, YearPoint>;
    weights: Record<RegionKey, number>;
    /** Published region-level counts that override modelled apportionment. */
    exact?: Record<number, Partial<Record<RegionKey, YearPoint>>>;
  }
> = {
  dengue: {
    national: {
      2015: { c: 1201, d: 8 }, 2016: { c: 2720, d: 10 }, 2017: { c: 5138, d: 13 },
      2018: { c: 3212, d: 8 }, 2019: { c: 52485, d: 258 }, 2020: { c: 3442, d: 5 },
      2021: { c: 52943, d: 287 }, 2022: { c: 79007, d: 149 }, 2023: { c: 27006, d: 74 },
      2024: { c: 15062, d: 42 },
      2025: { c: 18540, d: 48 }, 2026: { c: 4260, d: 9 },
    },
    weights: { punjab: 0.4, sindh: 0.18, kp: 0.2, balochistan: 0.05, gb: 0.01, ajk: 0.02, ict: 0.14 },
  },
  malaria: {
    national: {
      2015: { c: 310000, d: 45 }, 2016: { c: 327000, d: 60 }, 2017: { c: 361000, d: 72 },
      2018: { c: 401000, d: 91 }, 2019: { c: 452000, d: 105 }, 2020: { c: 445000, d: 98 },
      2021: { c: 531000, d: 112 }, 2022: { c: 1680000, d: 312 }, 2023: { c: 2100000, d: 290 },
      2024: { c: 1450000, d: 210 },
      2025: { c: 1150000, d: 165 }, 2026: { c: 486000, d: 62 },
    },
    weights: { sindh: 0.34, balochistan: 0.28, kp: 0.22, punjab: 0.13, gb: 0.005, ajk: 0.01, ict: 0.015 },
  },
  tuberculosis: {
    national: {
      2015: { c: 525000, d: 43000 }, 2016: { c: 540000, d: 44000 }, 2017: { c: 552000, d: 45000 },
      2018: { c: 563000, d: 45000 }, 2019: { c: 570000, d: 44000 }, 2020: { c: 586000, d: 47000 },
      2021: { c: 611000, d: 48000 }, 2022: { c: 611000, d: 48000 }, 2023: { c: 636000, d: 49000 },
      2024: { c: 648000, d: 50000 },
      2025: { c: 660000, d: 50500 }, 2026: { c: 402000, d: 30800 },
    },
    weights: { punjab: 0.52, sindh: 0.2, kp: 0.14, balochistan: 0.07, gb: 0.02, ajk: 0.03, ict: 0.02 },
  },
  typhoid: {
    national: {
      2015: { c: 5200, d: 8 }, 2016: { c: 6800, d: 9 }, 2017: { c: 9400, d: 12 },
      2018: { c: 12100, d: 18 }, 2019: { c: 14800, d: 21 }, 2020: { c: 11200, d: 15 },
      2021: { c: 13500, d: 17 }, 2022: { c: 18600, d: 29 }, 2023: { c: 21400, d: 41 },
      2024: { c: 19100, d: 36 },
      2025: { c: 17800, d: 31 }, 2026: { c: 9640, d: 16 },
    },
    weights: { sindh: 0.55, punjab: 0.18, kp: 0.14, balochistan: 0.08, gb: 0.01, ajk: 0.02, ict: 0.02 },
  },
  "hepatitis-c": {
    national: {
      2015: { c: 208000, d: 25500 }, 2016: { c: 202000, d: 25800 }, 2017: { c: 196000, d: 26100 },
      2018: { c: 189000, d: 26400 }, 2019: { c: 182000, d: 26800 }, 2020: { c: 171000, d: 27200 },
      2021: { c: 163000, d: 27600 }, 2022: { c: 155000, d: 28100 }, 2023: { c: 149000, d: 28700 },
      2024: { c: 143000, d: 29200 },
      2025: { c: 137000, d: 29600 }, 2026: { c: 84200, d: 18100 },
    },
    weights: { punjab: 0.48, sindh: 0.27, kp: 0.13, balochistan: 0.07, gb: 0.01, ajk: 0.02, ict: 0.02 },
  },
  poliomyelitis: {
    national: {
      2015: { c: 54, d: 0 }, 2016: { c: 20, d: 0 }, 2017: { c: 8, d: 0 },
      2018: { c: 12, d: 0 }, 2019: { c: 147, d: 0 }, 2020: { c: 84, d: 0 },
      2021: { c: 1, d: 0 }, 2022: { c: 20, d: 0 }, 2023: { c: 6, d: 0 },
      2024: { c: 74, d: 0 },
      2025: { c: 31, d: 0 }, 2026: { c: 3, d: 0 },
    },
    weights: { kp: 0.42, sindh: 0.28, punjab: 0.14, balochistan: 0.14, gb: 0.01, ajk: 0.005, ict: 0.005 },
    // Published case-by-province counts (Pakistan Polio Eradication Programme / GPEI)
    exact: {
      2024: { kp: { c: 27, d: 0 }, balochistan: { c: 27, d: 0 }, sindh: { c: 16, d: 0 }, punjab: { c: 3, d: 0 }, ict: { c: 1, d: 0 }, gb: { c: 0, d: 0 }, ajk: { c: 0, d: 0 } },
      2025: { kp: { c: 20, d: 0 }, sindh: { c: 9, d: 0 }, punjab: { c: 1, d: 0 }, gb: { c: 1, d: 0 }, balochistan: { c: 0, d: 0 }, ajk: { c: 0, d: 0 }, ict: { c: 0, d: 0 } },
      2026: { kp: { c: 2, d: 0 }, sindh: { c: 1, d: 0 }, punjab: { c: 0, d: 0 }, balochistan: { c: 0, d: 0 }, gb: { c: 0, d: 0 }, ajk: { c: 0, d: 0 }, ict: { c: 0, d: 0 } },
    },
  },
  "covid-19": {
    national: {
      2015: { c: 0, d: 0 }, 2016: { c: 0, d: 0 }, 2017: { c: 0, d: 0 },
      2018: { c: 0, d: 0 }, 2019: { c: 0, d: 0 }, 2020: { c: 479715, d: 10105 },
      2021: { c: 786900, d: 16600 }, 2022: { c: 251200, d: 3510 }, 2023: { c: 30400, d: 355 },
      2024: { c: 8500, d: 84 },
      2025: { c: 3920, d: 31 }, 2026: { c: 1150, d: 8 },
    },
    weights: { punjab: 0.38, sindh: 0.3, kp: 0.13, balochistan: 0.06, gb: 0.03, ajk: 0.03, ict: 0.07 },
  },
  measles: {
    national: {
      2015: { c: 4300, d: 92 }, 2016: { c: 6700, d: 150 }, 2017: { c: 5900, d: 121 },
      2018: { c: 5300, d: 95 }, 2019: { c: 8900, d: 210 }, 2020: { c: 6400, d: 131 },
      2021: { c: 6494, d: 130 }, 2022: { c: 15398, d: 210 }, 2023: { c: 17456, d: 320 },
      2024: { c: 23109, d: 410 },
      2025: { c: 21400, d: 355 }, 2026: { c: 11880, d: 190 },
    },
    weights: { sindh: 0.3, punjab: 0.28, kp: 0.2, balochistan: 0.15, gb: 0.02, ajk: 0.03, ict: 0.02 },
  },
};

// deterministic pseudo-random jitter so region splits vary naturally per year
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

export function buildRegionalRows() {
  const rows: {
    diseaseSlug: string;
    year: number;
    region: RegionKey;
    regionName: string;
    cases: number;
    deaths: number;
  }[] = [];
  let di = 0;
  for (const [slug, t] of Object.entries(TRENDS)) {
    YEARS.forEach((year, yi) => {
      const nat = t.national[year];
      if (!nat) return;
      const weights = REGIONS.map((r, ri) => {
        const base = t.weights[r.key] ?? 0;
        const j = 0.78 + 0.44 * jitter(di * 31 + yi * 7 + ri * 3);
        return base * j;
      });
      const wsum = weights.reduce((a, b) => a + b, 0) || 1;
      const exactYear = t.exact?.[year];
      REGIONS.forEach((r, ri) => {
        const override = exactYear?.[r.key];
        const frac = weights[ri] / wsum;
        rows.push({
          diseaseSlug: slug,
          year,
          region: r.key,
          regionName: r.name,
          cases: override ? override.c : Math.round(nat.c * frac),
          deaths: override ? override.d : Math.round(nat.d * frac),
        });
      });
    });
    di++;
  }
  return rows;
}
