import { db } from "@/db";
import { regionalStats } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { REGIONS } from "@/lib/regions";

export const dynamic = "force-dynamic";

const VALID_REGIONS = new Set<string>(REGIONS.map((r) => r.key as string));
const REGION_NAME = new Map<string, string>(REGIONS.map((r) => [r.key as string, r.name]));

interface Row {
  disease: string;
  year: number;
  region: string;
  cases: number;
  deaths: number;
}

function parseCsv(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error("CSV needs a header row plus at least one data row");
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (n: string) => header.indexOf(n);
  const iD = idx("disease"), iY = idx("year"), iR = idx("region"), iC = idx("cases"), iX = idx("deaths");
  if (iD < 0 || iY < 0 || iR < 0 || iC < 0) {
    throw new Error("CSV header must contain: disease,year,region,cases,deaths");
  }
  return lines.slice(1).map((line, n) => {
    const c = line.split(",").map((v) => v.trim());
    const row: Row = {
      disease: c[iD],
      year: Number(c[iY]),
      region: c[iR],
      cases: Number(c[iC]),
      deaths: iX >= 0 ? Number(c[iX] || 0) : 0,
    };
    if (!row.disease) throw new Error(`Row ${n + 2}: missing disease slug`);
    if (!Number.isFinite(row.year)) throw new Error(`Row ${n + 2}: invalid year`);
    if (!VALID_REGIONS.has(row.region)) {
      throw new Error(`Row ${n + 2}: region "${row.region}" must be one of ${[...VALID_REGIONS].join(", ")}`);
    }
    if (!Number.isFinite(row.cases)) throw new Error(`Row ${n + 2}: invalid cases`);
    return row;
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let rows: Row[];

    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { rows?: Row[] };
      if (!Array.isArray(body.rows)) throw new Error('JSON body must be { "rows": [...] }');
      rows = body.rows;
    } else {
      rows = parseCsv(await req.text());
    }

    if (rows.length === 0) throw new Error("No rows supplied");
    if (rows.length > 5000) throw new Error("Maximum 5000 rows per import");

    let written = 0;
    for (const r of rows) {
      await db
        .insert(regionalStats)
        .values({
          diseaseSlug: r.disease,
          year: r.year,
          region: r.region,
          regionName: REGION_NAME.get(r.region) ?? r.region,
          cases: Math.round(r.cases),
          deaths: Math.round(r.deaths ?? 0),
        })
        .onConflictDoUpdate({
          target: [regionalStats.diseaseSlug, regionalStats.year, regionalStats.region],
          set: { cases: sql`excluded.cases`, deaths: sql`excluded.deaths` },
        });
      written++;
    }

    return Response.json({ ok: true, written });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "import failed" },
      { status: 400 }
    );
  }
}

/** Verify what is currently stored for a disease/year pair. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const disease = searchParams.get("disease") ?? "dengue";
  const year = Number(searchParams.get("year") ?? 2026);
  const rows = await db
    .select()
    .from(regionalStats)
    .where(and(eq(regionalStats.diseaseSlug, disease), eq(regionalStats.year, year)));
  return Response.json({ disease, year, rows });
}
