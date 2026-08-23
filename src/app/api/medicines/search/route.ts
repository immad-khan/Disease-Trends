import { searchMedicines } from "@/data/medicineReference";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  return Response.json({ results: searchMedicines(q, 8) });
}
