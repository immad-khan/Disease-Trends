import { db } from "@/db";
import { patients } from "@/db/schema";
import { asc, ilike, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const rows = q
    ? await db
        .select()
        .from(patients)
        .where(or(ilike(patients.fullName, `%${q}%`), ilike(patients.medicalRecordNo, `%${q}%`)))
        .orderBy(asc(patients.fullName))
        .limit(20)
    : await db.select().from(patients).orderBy(asc(patients.fullName)).limit(50);
  return Response.json({ patients: rows });
}
