"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, CheckCircle2, ClipboardList, Copy, ExternalLink, FilePlus2, Loader2,
  MapPin, PackageCheck, Pill, Plus, RefreshCw, Search, Send, Stethoscope, Trash2,
  UserRound, XCircle,
} from "lucide-react";
import { MEDICINES, findMedicine, searchMedicines } from "@/data/medicineReference";
import type { MedicineOrderItemRow, MedicineOrderRow, MedicineVendorRow, PatientRow } from "@/db/schema";
import { Chip } from "@/components/ui";
import { VoiceField, VoiceTextarea } from "./VoiceField";
import VendorEditor from "./VendorEditor";
import PatientEditor from "./PatientEditor";

interface DraftMedicine {
  id: string; medicineName: string; matchedSlug: string | null; strength: string;
  dosage: string; frequency: string; duration: string; instructions: string;
  quantity: number; alternatives: string[];
}

interface FullOrder extends MedicineOrderRow {
  patient: PatientRow; vendor: MedicineVendorRow; items: MedicineOrderItemRow[];
}

function emptyItem(): DraftMedicine {
  return { id: crypto.randomUUID(), medicineName: "", matchedSlug: null, strength: "",
    dosage: "1 tablet", frequency: "Twice daily", duration: "5 days",
    instructions: "After food", quantity: 10, alternatives: [] };
}

function statusTone(s: string) {
  if (s === "fulfilled") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "partially_available") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "unavailable") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] outline-none focus:border-aqua-400">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MedicineRow({ item, onChange, onRemove }: { item: DraftMedicine; onChange: (v: DraftMedicine) => void; onRemove: () => void }) {
  const [suggestions, setSuggestions] = useState<typeof MEDICINES>([]);
  const [show, setShow] = useState(false);
  const ref = item.matchedSlug ? findMedicine(item.matchedSlug) : findMedicine(item.medicineName);

  useEffect(() => {
    setSuggestions(item.medicineName.length > 1 ? searchMedicines(item.medicineName) : []);
  }, [item.medicineName]);

  function choose(slug: string) {
    const med = findMedicine(slug);
    if (!med) return;
    const sameClass = MEDICINES.filter((m) => m.slug !== med.slug && m.drugClass === med.drugClass).slice(0, 2).map((m) => m.generic);
    onChange({ ...item, medicineName: med.generic, matchedSlug: med.slug, strength: med.availableStrengths[0] ?? "", alternatives: [...med.brandNames.slice(0, 2), ...sameClass] });
    setShow(false);
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="relative min-w-0 flex-1">
          <label className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Medicine</label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
            <input value={item.medicineName}
              onChange={(e) => { onChange({ ...item, medicineName: e.target.value, matchedSlug: null }); setShow(true); }}
              onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 150)}
              placeholder="Generic or brand name" className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-[12.5px] font-semibold outline-none focus:border-aqua-400" />
          </div>
          {show && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-aqua-100 bg-white shadow-lg">
              {suggestions.map((s) => (
                <button key={s.slug} onMouseDown={() => choose(s.slug)} className="flex w-full justify-between px-3 py-2 text-left text-[11.5px] hover:bg-aqua-50">
                  <span className="font-semibold text-slate-700">{s.generic}</span>
                  <span className="text-slate-400">{s.brandNames.slice(0, 2).join(" · ")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={onRemove} className="mt-5 rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-5">
        <VoiceField label="Strength" value={item.strength} placeholder="500 mg" onChange={(v) => onChange({ ...item, strength: v })} />
        <VoiceField label="Dose" value={item.dosage} placeholder="1 tablet" onChange={(v) => onChange({ ...item, dosage: v })} />
        <SelectField label="Frequency" value={item.frequency} options={["Once daily", "Twice daily", "Three times daily", "Four times daily", "As needed (SOS)"]} onChange={(v) => onChange({ ...item, frequency: v })} />
        <VoiceField label="Duration" value={item.duration} placeholder="5 days" onChange={(v) => onChange({ ...item, duration: v })} />
        <VoiceField label="Quantity" value={String(item.quantity)} type="number" onChange={(v) => onChange({ ...item, quantity: Math.max(1, Number(v) || 1) })} />
      </div>
      <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
        <SelectField label="Instructions" value={item.instructions} options={["Before food", "After food", "With food", "At bedtime", "In the morning", "As directed"]} onChange={(v) => onChange({ ...item, instructions: v })} />
        <VoiceField label="Allowed alternatives" value={item.alternatives.join(", ")} onChange={(v) => onChange({ ...item, alternatives: v.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Comma-separated" />
      </div>
      {ref && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
          <Chip>{ref.drugClass}</Chip>
          <span>Formula: <b>{ref.formula}</b></span>
          <span>· Available: {ref.availableStrengths.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

function NewOrder({ onCreated }: { onCreated: () => void }) {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [vendors, setVendors] = useState<MedicineVendorRow[]>([]);
  const [vendorKey, setVendorKey] = useState(0);
  const [patientId, setPatientId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Sarah Ahmed");
  const [doctorId, setDoctorId] = useState("OGD-D-1024");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftMedicine[]>([emptyItem()]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | { orderNo: string; responseUrl: string; smtpConfigured: boolean; vendor: { name: string; branch: string; authorizedPerson: string; address: string; phone: string; mapsUrl: string | null } }>(null);
  const [error, setError] = useState<string | null>(null);

  function loadMasters() {
    Promise.all([fetch("/api/patients").then((r) => r.json()), fetch("/api/vendors").then((r) => r.json())]).then(([p, v]) => {
      setPatients(p.patients ?? []);
      setVendors(v.vendors ?? []);
    });
  }
  useEffect(loadMasters, [vendorKey]);

  const patient = patients.find((p) => p.id === patientId);
  const vendor = vendors.find((v) => v.id === vendorId);
  const valid = patientId && vendorId && doctorName && doctorId && items.length > 0 && items.every((i) => i.medicineName && i.strength && i.dosage);

  async function send() {
    setSending(true); setError(null);
    try {
      const r = await fetch("/api/medicine-orders", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ patientId, vendorId, doctorName, doctorId, diagnosis, clinicalNotes: notes, items }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed");
      setResult(j); onCreated();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSending(false); }
  }

  if (result) {
    return (
      <div className="card p-5 sm:p-7">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></span>
          <h2 className="font-display mt-3 text-xl font-bold text-aqua-950">Order {result.orderNo} created</h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">
            Prescription sent to <b>{result.vendor.name} — {result.vendor.branch}</b>. Vendor details sent to patient.
          </p>
          <div className="mt-4 rounded-xl border border-aqua-100 bg-aqua-50/50 p-4 text-left text-[12px] text-slate-600">
            <p><b>Authorized:</b> {result.vendor.authorizedPerson}</p>
            <p className="mt-1"><b>Phone:</b> {result.vendor.phone}</p>
            <p className="mt-1 flex items-center gap-1.5">
              <b>Location:</b> {result.vendor.address}
              {result.vendor.mapsUrl && (
                <a href={result.vendor.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-aqua-600 hover:underline">
                  <MapPin className="h-3 w-3" /> View on map <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>
          </div>
          {!result.smtpConfigured && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-[11.5px] text-amber-700">
              <b>SMTP not configured:</b> order saved but emails are queued. Copy vendor response link below.
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <input readOnly value={result.responseUrl} className="min-w-0 flex-1 bg-transparent px-2 text-[10.5px] text-slate-500 outline-none" />
            <button onClick={() => navigator.clipboard.writeText(result.responseUrl)} className="rounded-lg p-2 text-aqua-600 hover:bg-white"><Copy className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => { setResult(null); setItems([emptyItem()]); setDiagnosis(""); setNotes(""); }} className="rounded-full bg-aqua-600 px-5 py-2.5 text-[12px] font-semibold text-white">Create another</button>
            <a href={result.responseUrl} target="_blank" className="rounded-full border border-aqua-200 px-5 py-2.5 text-[12px] font-semibold text-aqua-700">Open vendor portal</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><UserRound className="h-3.5 w-3.5" /> Select Patient</p>
              <PatientEditor patients={patients} onUpdated={() => setVendorKey((k) => k + 1)} />
            </div>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-aqua-400">
              <option value="">Choose by patient name / ID…</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.medicalRecordNo} — {p.fullName}</option>)}
            </select>
            {patient && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-aqua-50/60 p-3 text-[11.5px] text-slate-600">
                <p><b>ID:</b> {patient.medicalRecordNo}</p><p><b>City:</b> {patient.city}</p>
                <p><b>Email:</b> {patient.email}</p><p><b>Phone:</b> {patient.phone}</p>
                <p className="col-span-2"><b>Allergies:</b> {(patient.allergies as string[]).join(", ") || "None recorded"}</p>
              </div>
            )}
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Stethoscope className="h-3.5 w-3.5" /> Prescriber</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <VoiceField label="Doctor name" value={doctorName} onChange={setDoctorName} />
              <VoiceField label="Doctor ID" value={doctorId} onChange={setDoctorId} />
              <div className="col-span-2"><VoiceField label="Diagnosis / indication" value={diagnosis} onChange={setDiagnosis} placeholder="e.g. Acute bacterial sinusitis" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Pill className="h-3.5 w-3.5" /> Prescription ({items.length})</p>
          <button onClick={() => setItems((x) => [...x, emptyItem()])} className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 px-3 py-1.5 text-[11px] font-semibold text-aqua-700 hover:bg-aqua-50"><Plus className="h-3.5 w-3.5" /> Add medicine</button>
        </div>
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <MedicineRow key={item.id} item={item} onChange={(v) => setItems((all) => all.map((x) => x.id === v.id ? v : x))} onRemove={() => setItems((all) => all.filter((x) => x.id !== item.id))} />
          ))}
        </div>
        <VoiceTextarea value={notes} onChange={setNotes} placeholder="Clinical notes for vendor (optional)" label="Clinical notes" rows={3} />
      </div>

      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Building2 className="h-3.5 w-3.5" /> Approved Vendor</p>
          <VendorEditor vendors={vendors} onUpdated={() => setVendorKey((k) => k + 1)} />
        </div>
        <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-aqua-400">
          <option value="">Select vendor / branch…</option>
          {vendors.map((v) => <option key={v.id} value={v.id}>{v.name} — {v.branch} · {v.city}</option>)}
        </select>
        {vendor && (
          <div className="mt-3 grid gap-2 rounded-xl bg-aqua-50/60 p-3 text-[11.5px] text-slate-600 sm:grid-cols-2">
            <p><b>Authorized:</b> {vendor.authorizedPerson}</p><p><b>License:</b> {vendor.licenseNo}</p>
            <p><b>Email:</b> {vendor.email}</p><p><b>Phone:</b> {vendor.phone}</p>
            <p className="sm:col-span-2 flex items-center gap-2">
              <b>Location:</b> {vendor.address}
              {vendor.mapsUrl && (
                <a href={vendor.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-aqua-600 hover:underline">
                  <MapPin className="h-3 w-3" /> Open in Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>
          </div>
        )}
        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] text-rose-600">{error}</p>}
        <button disabled={!valid || sending} onClick={send} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua-600 to-teal-500 px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(20,127,158,.25)] disabled:opacity-50">
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Send order to vendor & patient
        </button>
      </div>
    </div>
  );
}

function OrderDashboard({ refreshKey }: { refreshKey: number }) {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [smtp, setSmtp] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/medicine-orders")
      .then((r) => r.json())
      .then((j) => { setOrders(j.orders ?? []); setSmtp(j.smtpConfigured); setLoading(false); })
      .catch(() => setLoading(false));
  }
  useEffect(load, [refreshKey]);

  function availIcon(a: string) {
    if (a === "in_stock" || a === "available") return <PackageCheck className="h-3.5 w-3.5 text-emerald-500" />;
    if (a === "unavailable" || a === "out_of_stock") return <XCircle className="h-3.5 w-3.5 text-rose-500" />;
    if (a === "substituted" || a === "alternative_available") return <PackageCheck className="h-3.5 w-3.5 text-amber-500" />;
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />;
  }
  function availLabel(a: string) {
    const map: Record<string, string> = {
      in_stock: "In stock", out_of_stock: "Out of stock",
      partial: "Partial", substituted: "Substituted",
      available: "Available", unavailable: "Unavailable",
      alternative_available: "Alternative", pending: "Pending",
      acknowledged: "Acknowledged", fulfilled: "Fulfilled",
    };
    return map[a] ?? a.replaceAll("_", " ");
  }

  const vendorResponded = (o: FullOrder) =>
    o.status === "fulfilled" || o.status === "acknowledged" || o.status === "collected" ||
    o.items?.some((i: any) => i.availability !== "pending");

  return (
    <div className="space-y-4">
      {!smtp && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] text-amber-700"><b>SMTP not configured.</b> Add EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD env vars.</div>}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        <button onClick={load} className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 px-3 py-1.5 text-[11px] font-semibold text-aqua-700">
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="card p-8 text-center text-[12px] text-slate-400">No orders yet.</div>
      ) : orders.map((o) => (
        <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          {/* Order header */}
          <div
            className="flex cursor-pointer flex-wrap items-start justify-between gap-3 p-4 sm:p-5"
            onClick={() => setExpanded(expanded === o.id ? null : o.id)}
          >
            <div>
              <p className="font-display text-[15px] font-bold text-aqua-950">{o.orderNo}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {o.patient?.medicalRecordNo} · {o.patient?.fullName} · Dr. {o.doctorName}
              </p>
              {vendorResponded(o) && (
                <p className="mt-1 text-[10.5px] font-semibold text-emerald-600">
                  ✓ Vendor responded
                  {(o as any).invoiceNumber ? ` · Invoice: ${(o as any).invoiceNumber}` : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusTone(o.status)}`}>
                {o.status.replaceAll("_", " ")}
              </span>
              <span className="text-slate-300 text-[10px]">{expanded === o.id ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Expanded detail */}
          <AnimatePresenceWrapper show={expanded === o.id}>
            <div className="border-t border-slate-100 p-4 sm:p-5 space-y-4">

              {/* Medicine items with vendor response */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua-600">Medicines & Vendor Response</p>
                <div className="space-y-2">
                  {o.items.map((i: any) => (
                    <div key={i.id} className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[12.5px] text-slate-800">
                            {i.medicineName}
                            {i.strength ? ` · ${i.strength}` : ""}
                            {i.substitutedName ? <span className="ml-1 text-amber-600"> → {i.substitutedName}</span> : ""}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {i.dosage ?? i.dose} · {i.frequency} · {i.duration} · Qty: {i.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold">
                          {availIcon(i.availability)}
                          <span className={
                            (i.availability === "in_stock" || i.availability === "available") ? "text-emerald-700" :
                            (i.availability === "out_of_stock" || i.availability === "unavailable") ? "text-rose-600" :
                            (i.availability === "substituted" || i.availability === "alternative_available") ? "text-amber-700" :
                            "text-sky-600"
                          }>
                            {availLabel(i.availability)}
                          </span>
                        </div>
                      </div>
                      {/* Vendor-filled details */}
                      {(i.qtySupplied > 0 || i.unitPrice || i.vendorNote || i.vendorItemNote) && (
                        <div className="mt-2 flex flex-wrap gap-3 rounded-lg bg-white px-2.5 py-2 text-[11px] text-slate-500">
                          {i.qtySupplied > 0 && <span><b>Supplied:</b> {i.qtySupplied}</span>}
                          {(i.unitPrice || i.unitPricePaisa) && (
                            <span><b>Unit price:</b> {i.unitPricePaisa != null
                              ? `PKR ${(i.unitPricePaisa / 100).toFixed(2)}`
                              : `PKR ${i.unitPrice}`}
                            </span>
                          )}
                          {i.batchNumber && <span><b>Batch:</b> {i.batchNumber}</span>}
                          {i.expiryDate && <span><b>Expiry:</b> {i.expiryDate}</span>}
                          {(i.vendorNote || i.vendorItemNote) && <span className="col-span-2"><b>Note:</b> {i.vendorNote ?? i.vendorItemNote}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill & invoice summary */}
              {((o as any).billAmountPaisa != null || (o as any).invoiceNumber || (o as any).billReference || (o as any).fulfilledAt) && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Bill & Invoice</p>
                  <div className="grid gap-2 text-[12px] text-slate-700 sm:grid-cols-2">
                    {(o as any).invoiceNumber && <p><b>Invoice #:</b> {(o as any).invoiceNumber}</p>}
                    {(o as any).billReference && <p><b>Bill Ref:</b> {(o as any).billReference}</p>}
                    {(o as any).billAmountPaisa != null && (
                      <p className="font-display text-[15px] font-bold text-emerald-800">
                        PKR {((o as any).billAmountPaisa / 100).toLocaleString("en-PK")}
                      </p>
                    )}
                    {(o as any).deliveryFee && parseFloat((o as any).deliveryFee) > 0 && (
                      <p><b>Delivery fee:</b> PKR {parseFloat((o as any).deliveryFee).toFixed(0)}</p>
                    )}
                    {(o as any).paymentMethod && <p><b>Payment:</b> {(o as any).paymentMethod}</p>}
                    {(o as any).paymentStatus && <p><b>Payment status:</b> {(o as any).paymentStatus}</p>}
                    {(o as any).fulfilledAt && <p><b>Fulfilled at:</b> {new Date((o as any).fulfilledAt).toLocaleString("en-PK")}</p>}
                    {(o as any).billDocumentUrl && (
                      <a href={(o as any).billDocumentUrl} target="_blank" rel="noreferrer" className="col-span-2 font-semibold text-aqua-600 hover:underline">
                        View bill document →
                      </a>
                    )}
                  </div>
                  {(o as any).vendorNotes && (
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-[11.5px] text-slate-600"><b>Vendor notes:</b> {(o as any).vendorNotes}</p>
                  )}
                </div>
              )}

              {/* Vendor card */}
              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                <p className="font-semibold text-aqua-900">{o.vendor?.name} — {o.vendor?.branch}</p>
                <p className="mt-1">Auth: {o.vendor?.authorizedPerson}</p>
                <p className="mt-0.5">Email: {o.vendorEmailStatus} · Patient: {o.patientEmailStatus}</p>
                {o.vendor?.mapsUrl && (
                  <a href={o.vendor.mapsUrl} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 font-semibold text-aqua-600 hover:underline">
                    <MapPin className="h-3 w-3" />View location<ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </AnimatePresenceWrapper>
        </motion.div>
      ))}
    </div>
  );
}

function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{children}</motion.div>;
}

export default function MedicineOrderModule() {
  const [tab, setTab] = useState<"new" | "orders">("new");
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-aqua-600"><ClipboardList className="h-3.5 w-3.5" /> Clinician Medicine Fulfillment</p>
        <h1 className="font-display mt-1.5 text-[clamp(1.5rem,3vw,2rem)] font-bold text-aqua-950">Prescribe, route and reconcile.</h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-500">Select a patient, dictate or type medicine details (every field has a 🎙️ mic button), choose an approved vendor (add/edit right here), and send the full order.</p>
      </div>
      <div className="mb-5 flex w-fit items-center gap-1 rounded-full border border-aqua-100 bg-white p-1 shadow-sm">
        {[{ id: "new" as const, label: "New Order", Icon: FilePlus2 }, { id: "orders" as const, label: "Orders & Bills", Icon: ClipboardList }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold ${tab === t.id ? "text-white" : "text-slate-500"}`}>
            {tab === t.id && <motion.span layoutId="order-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-aqua-600 to-teal-500" />}
            <t.Icon className="relative z-10 h-3.5 w-3.5" /><span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>
      {tab === "new" ? <NewOrder onCreated={() => setRefreshKey((x) => x + 1)} /> : <OrderDashboard refreshKey={refreshKey} />}
      <footer className="mt-8 border-t border-aqua-100 py-5 text-center text-[10.5px] text-slate-400">Voice input uses browser SpeechRecognition — works in Chrome, Edge & Safari · clinical data is confidential</footer>
    </div>
  );
}
