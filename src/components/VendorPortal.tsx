"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AVAIL_META,
  PAYMENT_METHODS,
  fmtDateTime,
  fmtRs,
  isExpiryPast,
  lineTotal,
  num,
  type Availability,
} from "@/lib/helpers";
import type { VendorPayload } from "@/lib/vendorPayload";
import {
  Btn,
  Card,
  Icon,
  Label,
  SectionHead,
  Segmented,
  SelectInput,
  TextArea,
  TextInput,
  ToastHost,
  cn,
  copyText,
  toast,
} from "@/components/ui";

type ItemState = {
  id: number;
  medicineName: string;
  strength: string | null;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  quantity: number;
  instructions: string | null;
  alternatives: string | null;
  availability: Availability;
  qtySupplied: number;
  substitutedName: string;
  unitPrice: string;
  discountPct: string;
  batchNumber: string;
  expiryDate: string;
  vendorNote: string;
};

type BillingState = {
  deliveryFee: string;
  paymentMethod: string;
  paymentStatus: string;
  vendorNotes: string;
};

function hydrateItems(payload: VendorPayload): ItemState[] {
  return payload.items.map((item) => ({
    id: item.id,
    medicineName: item.medicineName,
    strength: item.strength,
    dose: item.dose,
    frequency: item.frequency,
    duration: item.duration,
    quantity: item.quantity,
    instructions: item.instructions,
    alternatives: item.alternatives,
    availability: (item.availability as any) || "pending",
    qtySupplied: item.qtySupplied,
    substitutedName: item.substitutedName ?? "",
    unitPrice: item.unitPrice ?? "",
    discountPct: item.discountPct ?? "0",
    batchNumber: item.batchNumber ?? "",
    expiryDate: item.expiryDate ?? "",
    vendorNote: item.vendorNote ?? "",
  }));
}

export default function VendorPortal({ initial }: { initial: VendorPayload | null }) {
  if (!initial) return <InvalidLink />;
  return <VendorBillingForm initial={initial} />;
}

function InvalidLink() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#edf3f5] px-6">
      <Card className="max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-200">
          <Icon name="link" className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-slate-900">
          This vendor order link is invalid
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          The link may have expired or been mistyped. Please ask the organization to resend the
          prescription link.
        </p>
      </Card>
    </div>
  );
}

function VendorBillingForm({ initial }: { initial: VendorPayload }) {
  const { order, patient, vendor } = initial;
  const [items, setItems] = useState<ItemState[]>(() => hydrateItems(initial));
  const [billing, setBilling] = useState<BillingState>({
    deliveryFee: num(order.deliveryFee) ? String(num(order.deliveryFee)) : "0",
    paymentMethod: order.paymentMethod || "cash",
    paymentStatus: order.paymentStatus || "draft",
    vendorNotes: order.vendorNotes ?? "",
  });
  const [status, setStatus] = useState(order.status);
  const [invoiceNumber, setInvoiceNumber] = useState(order.invoiceNumber);
  const [busy, setBusy] = useState<"save" | "submit" | "pdf" | null>(null);
  const [showTraceability, setShowTraceability] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const submitted = status === "fulfilled" || status === "collected";
  const unresolved = items.filter((item) => item.availability === "pending").length;
  const missingPrice = items.filter(
    (item) => item.availability !== "out_of_stock" && item.availability !== "pending" && num(item.unitPrice) <= 0
  ).length;

  const totals = useMemo(() => {
    const rows = items.map((item) => {
      const qty = item.availability === "out_of_stock" ? 0 : item.qtySupplied;
      const gross = num(item.unitPrice) * qty;
      const amount = lineTotal(num(item.unitPrice), qty, num(item.discountPct));
      return { id: item.id, qty, gross, amount };
    });
    const subtotal = rows.reduce((sum, row) => sum + row.gross, 0);
    const total = rows.reduce((sum, row) => sum + row.amount, 0);
    return {
      rows,
      subtotal,
      discount: subtotal - total,
      delivery: Math.max(0, num(billing.deliveryFee)),
      grandTotal: total + Math.max(0, num(billing.deliveryFee)),
    };
  }, [billing.deliveryFee, items]);

  const availableCount = items.filter((item) => item.availability === "in_stock").length;
  const partialCount = items.filter((item) => item.availability === "partial").length;
  const unavailableCount = items.filter((item) => item.availability === "out_of_stock").length;

  function patchItem(id: number, patch: Partial<ItemState>) {
    if (submitted) return;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function setAvailability(id: number, availability: Availability) {
    if (submitted) return;
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        let qtySupplied = item.qtySupplied;
        if (availability === "in_stock" || availability === "substituted") qtySupplied = item.quantity;
        if (availability === "out_of_stock") qtySupplied = 0;
        if (availability === "partial") {
          qtySupplied = Math.min(Math.max(1, item.qtySupplied || item.quantity), item.quantity);
        }
        return { ...item, availability, qtySupplied };
      })
    );
  }

  function hydrateResponse(data: VendorPayload) {
    setItems(hydrateItems(data));
    setStatus(data.order.status);
    setInvoiceNumber(data.order.invoiceNumber);
    setBilling({
      deliveryFee: num(data.order.deliveryFee) ? String(num(data.order.deliveryFee)) : "0",
      paymentMethod: data.order.paymentMethod || "cash",
      paymentStatus: data.order.paymentStatus || "draft",
      vendorNotes: data.order.vendorNotes ?? "",
    });
  }

  async function save(action: "save" | "finalize") {
    setBusy(action === "finalize" ? "submit" : "save");
    try {
      const response = await fetch(`/api/vendor/${order.vendorToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          order: {
            ...billing,
            paymentStatus: action === "finalize" ? "submitted" : billing.paymentStatus,
          },
          items: items.map((item) => ({
            id: item.id,
            availability: item.availability,
            qtySupplied: item.qtySupplied,
            substitutedName: item.substitutedName,
            unitPrice: item.unitPrice,
            discountPct: item.discountPct,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            dispensed: false,
            vendorNote: item.vendorNote,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save this bill.");
      hydrateResponse(data as VendorPayload);
      if (action === "save") toast("Bill draft saved. You can finish it later.");
      else toast(`Bill ${data.order.invoiceNumber} submitted for organization payment.`);
    } catch (error) {
      toast((error as Error).message, "error");
    } finally {
      setBusy(null);
    }
  }

  const submitDisabled = submitted || unresolved > 0 || missingPrice > 0;
  const link = typeof window !== "undefined" ? window.location.href : "";

  const handleDownloadPDF = async () => {
    // We use "pdf" as busy state for this specific action
    // Need to cast it since it expects "save" | "submit" | null
    // Let's widen the type of busy to include "pdf" in state declaration
    setBusy("pdf" as any);
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const element = document.getElementById("pdf-capture-container");
      if (!element) throw new Error("Could not find bill to capture.");
      
      element.style.display = "block";
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      element.style.display = "none";
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OGDCL_Bill_${order.code}${invoiceNumber ? `_${invoiceNumber}` : ""}.pdf`);
      toast("PDF downloaded successfully.");
    } catch (error) {
      toast("Failed to generate PDF.", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3f5] pb-16">
      <ToastHost />
      
      {/* Hidden container for PDF generation */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none z-[-1]">
        <div id="pdf-capture-container" className="bg-white p-8 w-[800px] hidden">
          <BillTemplate payload={initial} items={items} invoiceNumber={invoiceNumber} totals={totals} billing={billing} />
        </div>
      </div>

      <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <img
            src="/images/ogdcl-logo.png"
            alt="OGDCL"
            className="animate-rise-in h-9 w-auto object-contain sm:h-10"
          />
          <div className="mr-auto hidden leading-tight sm:block">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Secure vendor billing portal
            </p>
          </div>
          <div className="mr-auto flex items-center gap-2 text-[12px] font-semibold text-slate-500 sm:mr-0">
            <Icon name="shield" className="h-4 w-4 text-teal-600" /> Prescription access link
          </div>
          <Btn variant="ghost" onClick={handleDownloadPDF} disabled={busy === "pdf"}>
            {busy === "pdf" ? <Icon name="loader" className="h-4 w-4 animate-spin" /> : <Icon name="download" className="h-4 w-4" />}
            Download PDF
          </Btn>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
              <Icon name="receipt" className="h-4 w-4" /> Vendor medicine bill
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.15rem)] font-extrabold leading-[1.05] tracking-tight text-[#0c2b3a]">
              Confirm availability & submit bill.
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-500">
              Review the prescription, mark what your pharmacy can provide, enter the actual price
              for each supplied medicine, and send the reconciled bill to the organization for payment.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Order reference</p>
            <p className="mt-0.5 font-display text-lg font-extrabold text-slate-900">{order.code}</p>
            <p className="text-[11.5px] text-slate-500">Received {fmtDateTime(order.createdAt)}</p>
          </div>
        </div>

        {submitted && (
          <div className="no-print animate-rise-in mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3.5 ring-1 ring-emerald-200">
            <div className="flex items-start gap-3">
              <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                <span className="absolute inset-0 animate-success-ring rounded-full ring-2 ring-emerald-400" />
                <CheckDraw />
              </span>
              <div>
                <p className="text-[13.5px] font-extrabold text-emerald-800">
                  Bill submitted for organization payment
                </p>
                <p className="mt-0.5 text-[12px] text-emerald-700">
                  Invoice {invoiceNumber ?? "generated"} is ready for the organization&apos;s payment desk.
                </p>
              </div>
            </div>
            <Btn variant="outline" onClick={() => setShowPrintPreview(true)}>
              <Icon name="receipt" className="h-3.5 w-3.5" /> View submitted bill
            </Btn>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-6">
            <Card className="animate-rise-in">
              <SectionHead icon="user" label="Patient & prescription details" right={<ReadOnlyBadge />} />
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <Label>Patient</Label>
                  <p className="font-display text-lg font-extrabold text-slate-900">{patient.name}</p>
                  <p className="mt-1 text-[12.5px] text-slate-500">
                    {patient.code} · {patient.age ?? "—"} years · {patient.gender ?? "—"}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-slate-500">{patient.phone ?? "No phone on file"}</p>
                  {patient.allergies && patient.allergies !== "None known" ? (
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[12px] font-bold text-rose-700 ring-1 ring-rose-200">
                      <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Allergy: {patient.allergies}
                    </div>
                  ) : (
                    <p className="mt-3 text-[11.5px] font-semibold text-emerald-600">No known allergies recorded</p>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Prescriber</Label>
                    <p className="text-[13.5px] font-bold text-slate-800">{order.doctorName}</p>
                    <p className="text-[12px] text-slate-500">{order.doctorId}</p>
                  </div>
                  <div>
                    <Label>Diagnosis</Label>
                    <p className="text-[13px] font-semibold text-slate-700">{order.diagnosis ?? "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Prescriber&apos;s notes</Label>
                    <p className="rounded-xl bg-white px-3 py-2.5 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-slate-200">
                      {order.clinicalNotes ?? "No additional instructions."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="animate-rise-in">
              <SectionHead
                icon="pill"
                label={`Medicines to reconcile · ${items.length}`}
                right={
                  <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-bold">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200">{availableCount} available</span>
                    {partialCount > 0 && <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-200">{partialCount} partial</span>}
                    {unavailableCount > 0 && <span className="rounded-full bg-rose-50 px-2 py-1 text-rose-700 ring-1 ring-rose-200">{unavailableCount} unavailable</span>}
                  </div>
                }
              />
              <div className="mb-4 rounded-xl bg-cyan-50/70 px-3.5 py-3 text-[12px] leading-relaxed text-cyan-800 ring-1 ring-cyan-100">
                Select the stock status for every line. Only supplied medicines are included in the
                organization bill; unavailable medicines automatically contribute Rs 0.
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <MedicineBillingRow
                    key={item.id}
                    item={item}
                    index={index}
                    locked={submitted}
                    showTraceability={showTraceability}
                    onAvailability={(value) => setAvailability(item.id, value)}
                    onPatch={(patch) => patchItem(item.id, patch)}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={submitted}
                onClick={() => setShowTraceability((value) => !value)}
                className="no-print mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-teal-700 transition hover:text-teal-900 disabled:opacity-40"
              >
                <Icon name={showTraceability ? "eyeOff" : "box"} className="h-3.5 w-3.5" />
                {showTraceability ? "Hide" : "Add"} batch & expiry details (optional)
              </button>
            </Card>

            <Card className="animate-rise-in">
              <SectionHead icon="building" label="Vendor confirmation" right={<ReadOnlyBadge label="Vendor editable" editable />} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Pharmacy / vendor</Label>
                  <p className="text-[13.5px] font-bold text-slate-800">{vendor.name}</p>
                  <p className="text-[12px] text-slate-500">
                    {vendor.branch ? `${vendor.branch} · ` : ""}{vendor.city ?? ""}
                  </p>
                </div>
                <div>
                  <Label>Authorized person</Label>
                  <p className="text-[13.5px] font-bold text-slate-800">{vendor.authorizedPerson ?? "—"}</p>
                  <p className="text-[12px] text-slate-500">License: {vendor.license ?? "—"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label>Note for organization payment desk (optional)</Label>
                <TextArea
                  disabled={submitted}
                  value={billing.vendorNotes}
                  placeholder="e.g. 2 medicines unavailable; patient agreed to collect available items…"
                  onChange={(event) => setBilling((current) => ({ ...current, vendorNotes: event.target.value }))}
                  className="min-h-[82px]"
                />
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="animate-rise-in lg:sticky lg:top-24">
              <SectionHead
                icon="receipt"
                label="Organization bill"
                right={
                  submitted ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-200">Submitted</span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10.5px] font-bold text-amber-700 ring-1 ring-amber-200">Draft</span>
                  )
                }
              />
              <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-4 text-white shadow-[0_10px_24px_rgba(13,148,136,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-100">Bill to</p>
                    <p className="mt-1 font-display text-[15px] font-bold">Organization payment desk</p>
                    <p className="mt-0.5 text-[11.5px] text-teal-100/80">Patient medicine reimbursement</p>
                  </div>
                  <Icon name="building" className="h-5 w-5 text-teal-100" />
                </div>
                <div className="mt-4 border-t border-white/15 pt-3 text-[12px]">
                  <div className="flex justify-between gap-3 text-teal-100/80"><span>Patient ID</span><span className="font-bold text-white">{patient.code}</span></div>
                  <div className="mt-1.5 flex justify-between gap-3 text-teal-100/80"><span>Order ref.</span><span className="font-bold text-white">{order.code}</span></div>
                  {invoiceNumber && <div className="mt-1.5 flex justify-between gap-3 text-teal-100/80"><span>Invoice no.</span><span className="font-bold text-white">{invoiceNumber}</span></div>}
                </div>
              </div>

              <div className="mt-5 space-y-2.5 border-b border-dashed border-slate-200 pb-4">
                {items.map((item, index) => {
                  const total = totals.rows[index];
                  return (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${index * 60}ms` }}
                      className="animate-rise-in flex items-start justify-between gap-3 text-[12.5px]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-700">{item.medicineName}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.availability === "out_of_stock" ? "Not supplied" : `${total.qty} × ${fmtRs(num(item.unitPrice))}`}
                        </p>
                      </div>
                      <span className="shrink-0 font-bold text-slate-800">
                        {total.qty > 0 ? fmtRs(total.amount) : "Rs 0"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-4 space-y-2 text-[12.5px]">
                <div className="flex justify-between text-slate-500"><dt>Medicine subtotal</dt><dd className="font-semibold text-slate-700">{fmtRs(totals.subtotal)}</dd></div>
                <div className="flex justify-between text-slate-500"><dt>Vendor discount</dt><dd className="font-semibold text-rose-500">− {fmtRs(totals.discount)}</dd></div>
                <div className="flex items-center justify-between gap-3 text-slate-500">
                  <dt>Delivery / misc. fee</dt>
                  <dd className="w-28"><TextInput disabled={submitted} type="number" min={0} value={billing.deliveryFee} onChange={(event) => setBilling((current) => ({ ...current, deliveryFee: event.target.value }))} className="px-2.5 py-1.5 text-right text-[12px]" /></dd>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-teal-50 px-3.5 py-3 ring-1 ring-teal-100">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.13em] text-teal-700">Amount payable</dt>
                  <dd className="font-display text-xl font-extrabold text-teal-800">
                    <CountUp value={totals.grandTotal} />
                  </dd>
                </div>
              </dl>

              <div className="no-print mt-5 space-y-3">
                <div>
                  <Label>Payment method requested</Label>
                  <SelectInput disabled={submitted} value={billing.paymentMethod} onChange={(event) => setBilling((current) => ({ ...current, paymentMethod: event.target.value }))}>
                    {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
                  </SelectInput>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-[12px] text-slate-500 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2 font-semibold text-slate-700"><Icon name="shield" className="h-3.5 w-3.5 text-teal-600" /> Payment status</div>
                  <p className="mt-1 leading-relaxed">{submitted ? "Submitted to organization for review and payment." : "This bill is still a draft and has not been sent for payment."}</p>
                </div>
                <Btn variant="outline" disabled={submitted || busy !== null} onClick={() => save("save")} className="w-full">
                  <Icon name="edit" className="h-4 w-4" />{busy === "save" ? "Saving draft…" : "Save draft"}
                </Btn>
                <Btn disabled={submitDisabled || busy !== null} onClick={() => save("finalize")} className="w-full py-3">
                  <Icon name="send" className="h-4 w-4" />{busy === "submit" ? "Submitting bill…" : "Submit bill for organization payment"}
                </Btn>
                {(unresolved > 0 || missingPrice > 0) && !submitted && (
                  <p className="flex items-start gap-2 text-[11.5px] font-semibold leading-relaxed text-amber-600">
                    <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {unresolved > 0 ? `Mark availability for ${unresolved} medicine${unresolved > 1 ? "s" : ""}.` : `Add a unit price for ${missingPrice} supplied medicine${missingPrice > 1 ? "s" : ""}.`}
                  </p>
                )}
              </div>

              <div className="no-print mt-4 flex flex-wrap gap-2 border-t border-dashed border-slate-200 pt-4">
                <Btn variant="ghost" className="px-2.5 py-2 text-[11.5px]" onClick={() => setShowPrintPreview(true)}><Icon name="download" className="h-3.5 w-3.5" /> View & Download PDF</Btn>
                <Btn variant="ghost" className="px-2.5 py-2 text-[11.5px]" onClick={async () => { const ok = await copyText(link); toast(ok ? "Order link copied." : "Could not copy link.", ok ? "success" : "error"); }}><Icon name="copy" className="h-3.5 w-3.5" /> Copy link</Btn>
              </div>
            </Card>
          </aside>
        </div>
      </main>

      {showPrintPreview && (
        <PrintPreview
          payload={initial}
          items={items}
          invoiceNumber={invoiceNumber}
          totals={totals}
          billing={billing}
          onClose={() => setShowPrintPreview(false)}
          onDownload={handleDownloadPDF}
          isDownloading={busy === "pdf"}
        />
      )}
    </div>
  );
}

function ReadOnlyBadge({ label = "Read only", editable = false }: { label?: string; editable?: boolean }) {
  return (
    <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold ring-1", editable ? "bg-teal-50 text-teal-700 ring-teal-200" : "bg-slate-50 text-slate-500 ring-slate-200")}>
      {label}
    </span>
  );
}

function MedicineBillingRow({
  item,
  index,
  locked,
  showTraceability,
  onAvailability,
  onPatch,
}: {
  item: ItemState;
  index: number;
  locked: boolean;
  showTraceability: boolean;
  onAvailability: (value: Availability) => void;
  onPatch: (patch: Partial<ItemState>) => void;
}) {
  const outOfStock = item.availability === "out_of_stock";
  const expired = isExpiryPast(item.expiryDate);
  const amount = lineTotal(num(item.unitPrice), outOfStock ? 0 : item.qtySupplied, num(item.discountPct));
  const availabilityOptions = (["in_stock", "partial", "out_of_stock", "substituted"] as Availability[]).map((value) => ({
    value,
    label: AVAIL_META[value].short,
    active: AVAIL_META[value].active,
  }));

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        "animate-rise-in rounded-2xl border bg-white p-4 transition-colors duration-300",
        outOfStock ? "border-rose-200 bg-rose-50/30" : "border-slate-200"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-50 font-display text-[13px] font-extrabold text-teal-700 ring-1 ring-teal-100 transition-transform">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-[15px] font-bold text-slate-900">
                {item.medicineName}{item.strength ? <span className="text-slate-400"> · {item.strength}</span> : null}
              </h3>
              <p className="mt-1 text-[12px] text-slate-500">
                {item.dose ?? "—"} · {item.frequency ?? "—"} · {item.duration ?? "—"} · <span className="font-bold text-slate-700">Prescribed {item.quantity}</span>
              </p>
              {item.instructions && <p className="mt-1 text-[11.5px] font-semibold text-cyan-700">Instruction: {item.instructions}</p>}
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-extrabold text-slate-900">{fmtRs(amount)}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">line total</p>
            </div>
          </div>

          <div className="mt-4">
            <Label>Availability at pharmacy</Label>
            <Segmented value={item.availability} onChange={onAvailability} options={availabilityOptions} />
          </div>

          {outOfStock ? (
            <div className="mt-3 grid gap-3 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-100 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex items-center gap-2 text-[12.5px] font-bold text-rose-700"><Icon name="alert" className="h-4 w-4" /> Not included in bill</div>
              <TextInput disabled={locked} value={item.vendorNote} placeholder="Why unavailable? Add a note for the organization…" onChange={(event) => onPatch({ vendorNote: event.target.value })} className="border-rose-200 bg-white" />
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {item.availability === "partial" && (
                  <div>
                    <Label>Qty supplied</Label>
                    <TextInput disabled={locked} type="number" min={1} max={item.quantity} value={item.qtySupplied || ""} onChange={(event) => onPatch({ qtySupplied: Math.min(item.quantity, Math.max(0, parseInt(event.target.value || "0", 10))) })} />
                    <p className="mt-1 text-[10.5px] text-slate-400">of {item.quantity} prescribed</p>
                  </div>
                )}
                {item.availability === "substituted" && (
                  <div className="sm:col-span-2">
                    <Label>Medicine supplied instead</Label>
                    <TextInput disabled={locked} value={item.substitutedName} placeholder="Actual brand / generic dispensed" onChange={(event) => onPatch({ substitutedName: event.target.value })} />
                    {item.alternatives && <p className="mt-1 text-[10.5px] text-slate-400">Allowed alternatives: {item.alternatives}</p>}
                  </div>
                )}
                <div>
                  <Label>Unit price (Rs)</Label>
                  <TextInput disabled={locked} type="number" min={0} step="0.01" value={item.unitPrice} placeholder="0" onChange={(event) => onPatch({ unitPrice: event.target.value })} />
                </div>
                <div>
                  <Label>Discount %</Label>
                  <TextInput disabled={locked} type="number" min={0} max={100} value={item.discountPct} onChange={(event) => onPatch({ discountPct: event.target.value })} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11.5px] text-slate-500 ring-1 ring-slate-100">
                <span><span className="font-bold text-slate-700">To bill:</span> {item.availability === "partial" ? item.qtySupplied : item.quantity} unit{(item.availability === "partial" ? item.qtySupplied : item.quantity) !== 1 ? "s" : ""}</span>
                <span className="font-bold text-teal-700">{fmtRs(amount)} after discount</span>
              </div>
            </>
          )}

          {!outOfStock && (
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: showTraceability ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mt-3 grid gap-3 border-t border-dashed border-slate-200 pt-3 sm:grid-cols-2">
                  <div><Label>Batch number</Label><TextInput disabled={locked} value={item.batchNumber} placeholder="e.g. BT-9921" onChange={(event) => onPatch({ batchNumber: event.target.value })} /></div>
                  <div><Label>Expiry date</Label><TextInput disabled={locked} type="date" value={item.expiryDate} onChange={(event) => onPatch({ expiryDate: event.target.value })} className={cn(expired && "border-rose-300 bg-rose-50 text-rose-700")} />{expired && <p className="mt-1 text-[10.5px] font-bold text-rose-600">Expired stock should not be supplied.</p>}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BillTemplate({
  payload,
  items,
  invoiceNumber,
  totals,
  billing,
}: {
  payload: VendorPayload;
  items: ItemState[];
  invoiceNumber: string | null;
  totals: { rows: { id: number; qty: number; gross: number; amount: number }[]; subtotal: number; discount: number; delivery: number; grandTotal: number };
  billing: BillingState;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Organization medicine reimbursement</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">{payload.vendor.name}</h2>
          <p className="text-[12px] text-slate-500">{payload.vendor.address}, {payload.vendor.city} · {payload.vendor.phone}</p>
          <p className="text-[12px] text-slate-500">License {payload.vendor.license} · {payload.vendor.email}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-extrabold text-slate-900">{invoiceNumber ?? "DRAFT BILL"}</p>
          <p className="text-[12px] text-slate-500">Order {payload.order.code}</p>
          <p className="text-[12px] text-slate-500">{fmtDateTime(new Date().toISOString())}</p>
        </div>
      </div>
      <div className="grid gap-4 border-b border-slate-200 py-4 text-[12.5px] sm:grid-cols-2">
        <div><p className="font-bold text-slate-700">Patient</p><p>{payload.patient.name} · {payload.patient.code}</p><p>{payload.patient.phone}</p></div>
        <div><p className="font-bold text-slate-700">Prescriber</p><p>{payload.order.doctorName} · {payload.order.doctorId}</p><p>{payload.order.diagnosis ?? "—"}</p></div>
      </div>
      <table className="mt-4 w-full border-collapse text-[12px]">
        <thead><tr className="border-b-2 border-teal-700 text-left"><th className="py-2 pr-2">Medicine</th><th className="py-2 pr-2">Availability</th><th className="py-2 pr-2 text-right">Qty</th><th className="py-2 pr-2 text-right">Unit</th><th className="py-2 text-right">Amount</th></tr></thead>
        <tbody>{items.map((item, index) => <tr key={item.id} className="border-b border-slate-200"><td className="py-2 pr-2">{item.medicineName} {item.strength}</td><td className="py-2 pr-2">{AVAIL_META[item.availability].label}</td><td className="py-2 pr-2 text-right">{totals.rows[index].qty}</td><td className="py-2 pr-2 text-right">{num(item.unitPrice).toFixed(2)}</td><td className="py-2 text-right">{totals.rows[index].amount.toFixed(2)}</td></tr>)}</tbody>
      </table>
      <div className="ml-auto mt-4 w-60 space-y-1.5 text-[12.5px]">
        <div className="flex justify-between"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>− {totals.discount.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery / misc.</span><span>{totals.delivery.toFixed(2)}</span></div>
        <div className="flex justify-between border-t-2 border-teal-700 pt-2 font-bold text-teal-800"><span>Total payable (Rs)</span><span>{totals.grandTotal.toFixed(2)}</span></div>
      </div>
      <p className="mt-6 text-[11px] text-slate-400">Payment requested via {PAYMENT_METHODS.find((method) => method.value === billing.paymentMethod)?.label ?? billing.paymentMethod}. This bill is submitted to the organization for review and payment.</p>
    </>
  );
}

function PrintPreview({
  payload,
  items,
  invoiceNumber,
  totals,
  billing,
  onClose,
  onDownload,
  isDownloading,
}: {
  payload: VendorPayload;
  items: ItemState[];
  invoiceNumber: string | null;
  totals: { rows: { id: number; qty: number; gross: number; amount: number }[]; subtotal: number; discount: number; delivery: number; grandTotal: number };
  billing: BillingState;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) {
  return (
    <div className="no-print fixed inset-0 z-50 overflow-auto bg-teal-950/40 p-4 backdrop-blur-sm animate-toast-in">
      <div className="animate-rise-in mx-auto my-6 max-w-3xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <BillTemplate payload={payload} items={items} invoiceNumber={invoiceNumber} totals={totals} billing={billing} />
        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
          <Btn variant="ghost" onClick={onClose} disabled={isDownloading}>Close</Btn>
          <Btn onClick={onDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Icon name="loader" className="h-4 w-4 animate-spin" />
            ) : (
              <Icon name="download" className="h-4 w-4" />
            )}
            {isDownloading ? "Generating PDF…" : "Download PDF"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Small motion helpers ------------------------- */

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (Math.abs(to - from) < 0.01) {
      setDisplay(to);
      return;
    }
    const duration = 420;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{fmtRs(display)}</span>;
}

function CheckDraw() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="m4 12.5 5 5L20 6.5"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-check"
        pathLength={1}
      />
    </svg>
  );
}
