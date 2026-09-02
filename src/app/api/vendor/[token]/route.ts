import { getVendorPayload, applyFulfillment } from "@/lib/vendorPayload";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payload = await getVendorPayload(token);
  if (!payload) {
    return Response.json({ ok: false, error: "Invalid or expired vendor link." }, { status: 404 });
  }
  return Response.json({ ok: true, ...payload });
}

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const body = await req.json();
    const updated = await applyFulfillment(token, body);
    return Response.json({ ok: true, ...updated });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to process fulfillment." },
      { status: 400 }
    );
  }
}
