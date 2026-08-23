import MedicineOrderModule from "@/components/medicine-orders/MedicineOrderModule";

export const metadata = {
  title: "Medicine Orders — OGDCL Clinical Fulfillment",
  description: "Clinician medicine ordering, approved vendor routing, stock reconciliation and invoice tracking.",
};

export default function MedicineOrdersPage() {
  return (
    <main className="min-h-dvh bg-[#f6fbfc]">
      <MedicineOrderModule />
    </main>
  );
}
