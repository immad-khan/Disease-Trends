import { db } from "@/db";
import { medicineVendors } from "@/db/schema";
import { and, asc, eq, ilike } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim();
  const where = city
    ? and(eq(medicineVendors.status, "active"), ilike(medicineVendors.city, city))
    : eq(medicineVendors.status, "active");
  const rows = await db
    .select()
    .from(medicineVendors)
    .where(where)
    .orderBy(asc(medicineVendors.name), asc(medicineVendors.branch));
  return Response.json({ vendors: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, branch, email, phone, authorizedPerson, licenseNo, address, city, latitude, longitude, mapsUrl } = body;
    if (!name || !branch || !email || !authorizedPerson || !address || !city) {
      return Response.json({ ok: false, error: "Name, branch, email, authorized person, address and city are required." }, { status: 400 });
    }
    const id = `ven-${crypto.randomUUID().slice(0, 8)}`;
    const gmaps = mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${branch} ${city}`)}`;
    await db.insert(medicineVendors).values({
      id, name, branch, email, phone: phone || null, authorizedPerson,
      licenseNo: licenseNo || null, address, city,
      latitude: latitude || null, longitude: longitude || null,
      mapsUrl: gmaps, status: "active",
    });
    const [row] = await db.select().from(medicineVendors).where(eq(medicineVendors.id, id)).limit(1);
    return Response.json({ ok: true, vendor: row });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
