export const dynamic = "force-dynamic";

const mockPatients = [
  { id: "pat-1", medicalRecordNo: "MR-001", fullName: "Ahmad Khan", city: "Lahore", email: "ahmad@example.com", phone: "0300-1234567", allergies: ["Penicillin"] },
  { id: "pat-2", medicalRecordNo: "MR-002", fullName: "Fatima Ali", city: "Karachi", email: "fatima@example.com", phone: "0321-7654321", allergies: [] },
  { id: "pat-3", medicalRecordNo: "MR-003", fullName: "Zainab Bibi", city: "Islamabad", email: "zainab@example.com", phone: "0333-9876543", allergies: ["Sulfa drugs"] },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  
  let rows = mockPatients;
  if (q) {
    rows = rows.filter(p => p.fullName.toLowerCase().includes(q) || p.medicalRecordNo.toLowerCase().includes(q));
  }
  
  return Response.json({ patients: rows });
}
