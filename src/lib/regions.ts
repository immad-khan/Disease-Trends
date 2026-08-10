import type { RegionKey } from "./types";

export interface RegionMeta {
  key: RegionKey;
  name: string;
  abbr: string;
  capital: string;
  population: number; // Census 2023
}

export const REGIONS: RegionMeta[] = [
  { key: "punjab", name: "Punjab", abbr: "PB", capital: "Lahore", population: 127688922 },
  { key: "sindh", name: "Sindh", abbr: "SD", capital: "Karachi", population: 55894697 },
  { key: "kp", name: "Khyber Pakhtunkhwa", abbr: "KP", capital: "Peshawar", population: 40856573 },
  { key: "balochistan", name: "Balochistan", abbr: "BL", capital: "Quetta", population: 14894402 },
  { key: "gb", name: "Gilgit-Baltistan", abbr: "GB", capital: "Gilgit", population: 1700000 },
  { key: "ajk", name: "Azad J&K", abbr: "AJK", capital: "Muzaffarabad", population: 4045366 },
  { key: "ict", name: "Islamabad (ICT)", abbr: "ICT", capital: "Islamabad", population: 2363463 },
];

export const YEARS = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
] as const;

export const CURRENT_YEAR = 2026;

/** Confidence flag shown next to every year in the UI. */
export const YEAR_STATUS: Record<number, "final" | "provisional" | "ytd"> = {
  2015: "final", 2016: "final", 2017: "final", 2018: "final", 2019: "final",
  2020: "final", 2021: "final", 2022: "final", 2023: "final", 2024: "final",
  2025: "provisional",
  2026: "ytd",
};

export const YEAR_STATUS_LABEL: Record<"final" | "provisional" | "ytd", string> = {
  final: "Final — official annual returns",
  provisional: "Provisional — 2025 returns still being reconciled",
  ytd: "Year-to-date 2026 — partial year, updates weekly",
};

export const REGION_NAME: Record<RegionKey, string> = Object.fromEntries(
  REGIONS.map((r) => [r.key, r.name])
) as Record<RegionKey, string>;

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return n.toLocaleString("en-PK");
}

export function formatPKR(n: number): string {
  return `₨ ${n.toLocaleString("en-PK")}`;
}
