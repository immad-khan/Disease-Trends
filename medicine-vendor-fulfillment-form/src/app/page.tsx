import VendorPortal from "@/components/VendorPortal";
import { ensureSeed } from "@/db/seed";
import { DEMO_VENDOR_TOKEN } from "@/db/seed";
import { getVendorPayload } from "@/lib/vendorPayload";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSeed();
  const payload = await getVendorPayload(DEMO_VENDOR_TOKEN);
  return <VendorPortal initial={payload} />;
}
