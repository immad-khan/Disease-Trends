import { db } from "@/db";
import { medicineVendors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { name, branch, email, phone, authorizedPerson, licenseNo, address, city, latitude, longitude, mapsUrl, status } = body;
  const gmaps = mapsUrl || (name && city ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${branch || ""} ${city}`)}` : undefined);
  const patch: Record<string, unknown> = {};
  if (name !== undefined) patch.name = name;
  if (branch !== undefined) patch.branch = branch;
  if (email !== undefined) patch.email = email;
  if (phone !== undefined) patch.phone = phone;
  if (authorizedPerson !== undefined) patch.authorizedPerson = authorizedPerson;
  if (licenseNo !== undefined) patch.licenseNo = licenseNo;
  if (address !== undefined) patch.address = address;
  if (city !== undefined) patch.city = city;
  if (latitude !== undefined) patch.latitude = latitude;
  if (longitude !== undefined) patch.longitude = longitude;
  if (gmaps !== undefined) patch.mapsUrl = gmaps;
  if (status !== undefined) patch.status = status;
  if (Object.keys(patch).length === 0) return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  await db.update(medicineVendors).set(patch).where(eq(medicineVendors.id, id));
  const [row] = await db.select().from(medicineVendors).where(eq(medicineVendors.id, id)).limit(1);
  return Response.json({ ok: true, vendor: row });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.delete(medicineVendors).where(eq(medicineVendors.id, id));
  return Response.json({ ok: true });
}
