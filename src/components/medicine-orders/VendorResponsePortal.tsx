"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  PackageCheck,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { MedicineOrderItemRow, MedicineOrderRow, MedicineVendorRow, PatientRow } from "@/db/schema";

interface ResponseItem {
  id: string;
  availability: "available" | "alternative_available" | "unavailable";
  suppliedMedicine: string;
  suppliedQuantity: number;
  unitPrice: string;
  vendorItemNote: string;
}

export default function VendorResponsePortal({ token }: { token: string }) {
  const [order, setOrder] = useState<MedicineOrderRow | null>(null);
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [vendor, setVendor] = useState<MedicineVendorRow | null>(null);
  const [sourceItems, setSourceItems] = useState<MedicineOrderItemRow[]>([]);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [billReference, setBillReference] = useState("");
  const [billDocumentUrl, setBillDocumentUrl] = useState("");
  const [vendorNote, setVendorNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/vendor-orders/${token}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error);
        setOrder(j.order);
        setPatient(j.patient);
        setVendor(j.vendor);
        setSourceItems(j.items);
        setBillReference(j.order.billReference ?? "");
        setBillDocumentUrl(j.order.billDocumentUrl ?? "");
        setVendorNote(j.order.vendorNote ?? "");
        setResponses(
          j.items.map((i: MedicineOrderItemRow) => ({
            id: i.id,
            availability: i.availability === "pending" ? "available" : i.availability,
            suppliedMedicine: i.suppliedMedicine || i.medicineName,
            suppliedQuantity: i.suppliedQuantity ?? i.quantity,
            unitPrice: i.unitPricePaisa != null ? String(i.unitPricePaisa / 100) : "",
            vendorItemNote: i.vendorItemNote ?? "",
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Could not load order");
        setLoading(false);
      });
  }, [token]);

  const totalPaisa = useMemo(
    () =>
      responses.reduce(
        (sum, r) =>
          r.availability === "unavailable"
            ? sum
            : sum + Math.round((Number(r.unitPrice) || 0) * 100) * r.suppliedQuantity,
        0
      ),
    [responses]
  );

  function update(id: string, patch: Partial<ResponseItem>) {
    setResponses((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch(`/api/vendor-orders/${token}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          billReference,
          billAmountPaisa: totalPaisa,
          billDocumentUrl,
          vendorNote,
          items: responses.map((i) => ({
            ...i,
            unitPricePaisa: Math.round((Number(i.unitPrice) || 0) * 100),
          })),
        }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-aqua-500" /></div>;
  }
  if (error && !order) {
    return <div className="mx-auto mt-20 max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">{error}</div>;
  }
  if (!order || !patient || !vendor) return null;

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span>
        <h1 className="font-display mt-4 text-2xl font-bold text-aqua-950">Response submitted</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">Availability and invoice details for <b>{order.orderNo}</b> are now visible in the doctor’s Orders &amp; Bills dashboard. The patient has been notified if SMTP is configured.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 rounded-xl border border-aqua-100 bg-white p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-aqua-600"><ShieldCheck className="h-3.5 w-3.5" /> Authorized Vendor Portal</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-aqua-950">{order.orderNo}</h1>
            <p className="mt-1 text-[12px] text-slate-500">Respond on behalf of {vendor.name} — {vendor.branch}</p>
          </div>
          <span className="rounded-full border border-aqua-200 bg-aqua-50 px-3 py-1.5 text-[10px] font-bold uppercase text-aqua-700">{order.status.replaceAll("_", " ")}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-aqua-600"><UserRound className="h-3.5 w-3.5" /> Patient</p>
          <p className="font-display mt-2 text-[14px] font-bold text-aqua-950">{patient.fullName}</p>
          <p className="mt-1 text-[11.5px] text-slate-500">{patient.medicalRecordNo} · {patient.phone}</p>
          <p className="mt-1 text-[11.5px] text-slate-500">{patient.address}</p>
          <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] text-rose-600"><b>Allergies:</b> {(patient.allergies as string[]).join(", ") || "None recorded"}</p>
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-aqua-600"><Building2 className="h-3.5 w-3.5" /> Vendor identity</p>
          <p className="font-display mt-2 text-[14px] font-bold text-aqua-950">{vendor.authorizedPerson}</p>
          <p className="mt-1 text-[11.5px] text-slate-500">License {vendor.licenseNo} · {vendor.phone}</p>
          <p className="mt-1 text-[11.5px] text-slate-500">Doctor: {order.doctorName} ({order.doctorId})</p>
        </div>
      </div>

      <div className="mt-4 card p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-aqua-600"><PackageCheck className="h-3.5 w-3.5" /> Medicine availability</p>
        <p className="mt-1 text-[11px] text-slate-400">Every item must be marked. If using an approved alternative, enter the actual supplied medicine.</p>
        <div className="mt-4 space-y-3">
          {sourceItems.map((item, index) => {
            const response = responses.find((r) => r.id === item.id)!;
            return (
              <div key={item.id} className="rounded-xl border border-slate-100 p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{index + 1}. {item.medicineName} · {item.strength}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{item.dosage} · {item.frequency} · {item.duration} · Qty {item.quantity}</p>
                    <p className="mt-1 text-[10.5px] text-aqua-700">Allowed alternatives: {(item.alternatives as string[]).join(", ") || "None"}</p>
                  </div>
                  <select value={response.availability} onChange={(e) => update(item.id, { availability: e.target.value as ResponseItem["availability"] })} className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold outline-none ${response.availability === "unavailable" ? "border-rose-200 bg-rose-50 text-rose-700" : response.availability === "alternative_available" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    <option value="available">Available</option><option value="alternative_available">Alternative available</option><option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  <Field label="Supplied medicine" value={response.suppliedMedicine} disabled={response.availability === "unavailable"} onChange={(v) => update(item.id, { suppliedMedicine: v })} />
                  <Field label="Supplied qty" value={String(response.suppliedQuantity)} type="number" disabled={response.availability === "unavailable"} onChange={(v) => update(item.id, { suppliedQuantity: Number(v) || 0 })} />
                  <Field label="Unit price PKR" value={response.unitPrice} type="number" disabled={response.availability === "unavailable"} onChange={(v) => update(item.id, { unitPrice: v })} />
                  <Field label="Item note" value={response.vendorItemNote} onChange={(v) => update(item.id, { vendorItemNote: v })} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 card p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-aqua-600"><FileText className="h-3.5 w-3.5" /> Bill / invoice</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Invoice / bill number" value={billReference} onChange={setBillReference} placeholder="e.g. SHC-INV-10452" />
          <div><label className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Calculated total</label><p className="font-display mt-1 rounded-lg bg-aqua-50 px-3 py-2 text-[16px] font-bold text-aqua-900">PKR {(totalPaisa / 100).toLocaleString("en-PK")}</p></div>
          <div className="sm:col-span-2"><Field label="Bill document URL (DMS / cloud storage)" value={billDocumentUrl} onChange={setBillDocumentUrl} placeholder="https://…/invoice.pdf" /></div>
          <div className="sm:col-span-2"><label className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">Vendor note</label><textarea value={vendorNote} onChange={(e) => setVendorNote(e.target.value)} className="mt-1 min-h-20 w-full resize-none rounded-lg border border-slate-200 p-2.5 text-[11.5px] outline-none focus:border-aqua-400" /></div>
        </div>
        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] text-rose-600">{error}</p>}
        <button onClick={submit} disabled={saving || responses.length !== sourceItems.length} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua-600 to-teal-500 px-5 py-2.5 text-[12px] font-semibold text-white disabled:opacity-50">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Submit availability & bill</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
  return <div><label className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">{label}</label><input type={type} value={value} disabled={disabled} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] outline-none focus:border-aqua-400 disabled:bg-slate-50 disabled:text-slate-300" /></div>;
}
