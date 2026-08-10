import { CITIES, CITY_BY_DISEASE } from "@/data/cities";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const disease = searchParams.get("disease");
  if (disease) {
    return Response.json({
      disease,
      cities: CITY_BY_DISEASE[disease] ?? [],
    });
  }
  return Response.json({ cities: CITIES, byDisease: CITY_BY_DISEASE });
}
