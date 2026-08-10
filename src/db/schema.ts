import { integer, jsonb, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const diseases = pgTable("diseases", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  tagline: text("tagline").notNull(),
  category: text("category").notNull(),
  icd: text("icd").notNull(),
  icon: text("icon").notNull(),
  hue: text("hue").notNull(),
  severity: integer("severity").notNull().default(5),
  payload: jsonb("payload").notNull(),
});

export const regionalStats = pgTable(
  "regional_stats",
  {
    diseaseSlug: text("disease_slug").notNull(),
    year: integer("year").notNull(),
    region: text("region").notNull(),
    regionName: text("region_name").notNull(),
    cases: integer("cases").notNull().default(0),
    deaths: integer("deaths").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.diseaseSlug, t.year, t.region] }),
  ]
);

export type DiseaseRow = typeof diseases.$inferSelect;
export type RegionStatRow = typeof regionalStats.$inferSelect;
