import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { diseases, regionalStats } from "./schema";
import { diseases1 } from "./data/diseases-1";
import { diseases2 } from "./data/diseases-2";
import { diseases3 } from "./data/diseases-3";
import { diseases4 } from "./data/diseases-4";
import { buildRegionalRows } from "./data/trends";

config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const all = [...diseases1, ...diseases2, ...diseases3, ...diseases4];
  console.log(`Seeding ${all.length} diseases…`);

  await db.delete(regionalStats);
  await db.delete(diseases);

  for (const d of all) {
    const { severity, ...rest } = d;
    await db.insert(diseases).values({
      slug: d.slug,
      name: d.name,
      shortName: d.shortName,
      tagline: d.tagline,
      category: d.category,
      icd: d.icd,
      icon: d.icon,
      hue: d.hue,
      severity: d.severity,
      payload: rest,
    });
  }

  const rows = buildRegionalRows();
  console.log(`Seeding ${rows.length} regional stat rows…`);
  // batch inserts
  const CHUNK = 140;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await db.insert(regionalStats).values(rows.slice(i, i + CHUNK));
  }

  console.log("Seed complete.");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
