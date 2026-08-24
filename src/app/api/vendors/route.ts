export const dynamic = "force-dynamic";

let mockVendors = [
  { id: "ven-1", name: "Al-Shifa Pharmacy", branch: "Main Branch", email: "contact@alshifa.com", phone: "042-31112222", authorizedPerson: "Dr. Usman", licenseNo: "LIC-8812", address: "123 Health Ave", city: "Lahore", latitude: 31.5204, longitude: 74.3587, mapsUrl: "", status: "active" },
  { id: "ven-2", name: "City Meds", branch: "DHA Phase 5", email: "dha@citymeds.pk", phone: "042-35556666", authorizedPerson: "Ali Raza", licenseNo: "LIC-9923", address: "45-A DHA Phase 5", city: "Lahore", latitude: 31.4646, longitude: 74.4098, mapsUrl: "", status: "active" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim().toLowerCase();
  
  let rows = mockVendors.filter(v => v.status === "active");
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
    mockVendors.push(newVendor);
    
    return Response.json({ ok: true, vendor: newVendor });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
