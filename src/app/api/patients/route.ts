import { getPatients, addPatient } from "@/lib/jsonStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  
  let rows = getPatients();
  if (q) {
    rows = rows.filter(p => p.fullName.toLowerCase().includes(q) || p.medicalRecordNo.toLowerCase().includes(q));
  }
  
  return Response.json({ patients: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPatient = {
      id: "pat-" + Date.now(),
      medicalRecordNo: body.medicalRecordNo || ("MR-" + Math.floor(Math.random() * 10000)),
      fullName: body.fullName,
      city: body.city,
      email: body.email,
      phone: body.phone,
      allergies: body.allergies || []
    };
    addPatient(newPatient);
    return Response.json({ ok: true, patient: newPatient });
  } catch (e) {
    return Response.json({ ok: false, error: "Invalid patient data" }, { status: 400 });
  }
}
