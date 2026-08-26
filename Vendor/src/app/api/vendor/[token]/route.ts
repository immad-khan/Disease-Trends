import { NextResponse } from "next/server";
import { applyFulfillment, getVendorPayload, type FulfillmentBody } from "@/lib/vendorPayload";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  const payload = await getVendorPayload(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or revoked fulfillment link." }, { status: 404 });
  }
  return NextResponse.json(payload);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { token } = await params;
  const body = (await req.json().catch(() => null)) as FulfillmentBody | null;
  if (!body || !body.action || !Array.isArray(body.items) || !body.order) {
    return NextResponse.json({ error: "Malformed fulfillment payload." }, { status: 400 });
  }
  try {
    const payload = await applyFulfillment(token, body);
    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
