import type { Metadata } from "next";
import VendorPortal from "@/components/VendorPortal";
import { getVendorPayload } from "@/lib/vendorPayload";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const payload = await getVendorPayload(token);
  return {
    title: payload
      ? `Fulfill ${payload.order.code} · ${payload.vendor.name}`
      : "Vendor fulfillment",
  };
}

export default async function VendorFulfillPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = await getVendorPayload(token);
  return <VendorPortal initial={payload} />;
}
