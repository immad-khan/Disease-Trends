import { getVendors, addVendor } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim().toLowerCase();
  
  const allVendors = getVendors();
  let rows = allVendors.filter(v => v.status === "active");
  if (city) {
    rows = rows.filter(v => v.city.toLowerCase() === city);
  }
  
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
    
    const newVendor = {
      id, name, branch, email, phone: phone || null, authorizedPerson,
      licenseNo: licenseNo || null, address, city,
      latitude: latitude || null, longitude: longitude || null,
      mapsUrl: gmaps, status: "active",
    };
    
    addVendor(newVendor);
    
    return Response.json({ ok: true, vendor: newVendor });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
