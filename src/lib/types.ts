export type RegionKey =
  | "punjab"
  | "sindh"
  | "kp"
  | "balochistan"
  | "gb"
  | "ajk"
  | "ict";

export interface Medicine {
  name: string;
  brand: string;
  form: string;
  price: number; // PKR indicative retail (DRAP MRP 2024)
  note: string;
}

export interface LabTest {
  name: string;
  purpose: string;
  price: number; // PKR indicative private lab
  turnaround: string;
}

export interface Stage {
  name: string;
  window: string;
  desc: string;
}

export interface EnvironmentInfo {
  climate: string; // e.g., Tropical monsoon, Arid desert
  temperature: string; // e.g., 25-35°C optimal
  humidity: string;
  terrain: string; // plains, riverine, mountainous
  waterSanitation: string;
  seasonality: string; // Jun-Nov
  urbanRural: string;
  carryingMedium: string; // vector, water, air
  description: string;
  riskFactors: string[];
}

export interface CityBurden {
  city: string;
  province: RegionKey;
  lat: number;
  lon: number;
  population: number;
  topDisease: string;
  topDiseaseSlug: string;
  casesShare: string;
  environment: string;
  note: string;
}

export interface DiseasePayload {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  taxonomy: string;
  icd: string;
  icd11: string | null;
  acronyms: string[];
  synonyms: string[];
  cause: string;
  transmission: string[];
  riskFactors: string[];
  mechanism: string[];
  organs: string[];
  biomarkers: string[];
  incubation: string;
  signs: string[];
  symptoms: string[];
  stages: Stage[];
  prevalence: string;
  incidence: string;
  global: string;
  demographics: string[];
  geography: string;
  criteria: string;
  imaging: string[];
  differential: string[];
  treatment: string[];
  prevention: string[];
  prognosis: string;
  medicines: Medicine[];
  tests: LabTest[];
  peakYearNote: string;
  source: string;
  icon: string;
  hue: string;
  severity: number;
  environment?: EnvironmentInfo;
}

export interface DiseaseSummary {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  icd: string;
  icon: string;
  hue: string;
  severity: number;
  cases2024: number;
  deaths2024: number;
  totalCases: number;
  peakYear: number;
  peakCases: number;
  peakRegion: string;
  peakRegionCases: number;
}

export interface RegionStat {
  diseaseSlug: string;
  year: number;
  region: RegionKey;
  regionName: string;
  cases: number;
  deaths: number;
}

export interface LiveReport {
  id: string;
  region: RegionKey;
  district: string;
  diseaseSlug: string;
  disease: string;
  cases: number;
  minutesAgo: number;
  source: string;
  kind: "report" | "alert" | "campaign";
}
