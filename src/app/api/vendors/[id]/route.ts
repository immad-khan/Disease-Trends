import { updateVendor, deleteVendor } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
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
    const updated = updateVendor(id, patch);
    if (!updated) return Response.json({ ok: false, error: "Vendor not found" }, { status: 404 });
    return Response.json({ ok: true, vendor: updated });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const ok = deleteVendor(id);
    if (!ok) return Response.json({ ok: false, error: "Vendor not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
