import VendorResponsePortal from "@/components/medicine-orders/VendorResponsePortal";

export const metadata = {
  title: "Vendor Order Response — OGDCL",
  description: "Authorized pharmacy portal for medicine availability and invoice submission.",
};

export default async function VendorOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="min-h-dvh bg-[#f6fbfc]">
      <VendorResponsePortal token={token} />
    </main>
  );
}
