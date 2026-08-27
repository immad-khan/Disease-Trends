"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2, Edit3, ExternalLink, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import type { MedicineVendorRow } from "@/db/schema";
import { VoiceField } from "./VoiceField";

interface VendorDraft {
  name: string;
  branch: string;
  email: string;
  phone: string;
  authorizedPerson: string;
  licenseNo: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  mapsUrl: string;
}

function emptyDraft(): VendorDraft {
  return { name: "", branch: "", email: "", phone: "", authorizedPerson: "", licenseNo: "", address: "", city: "", latitude: "", longitude: "", mapsUrl: "" };
}

function fromRow(v: MedicineVendorRow): VendorDraft {
  return {
    name: v.name,
    branch: v.branch,
    email: v.email,
    phone: v.phone ?? "",
    authorizedPerson: v.authorizedPerson,
    licenseNo: v.licenseNo ?? "",
    address: v.address,
    city: v.city,
    latitude: v.latitude ?? "",
    longitude: v.longitude ?? "",
    mapsUrl: v.mapsUrl ?? "",
  };
}

export default function VendorEditor({
  vendors,
  onUpdated,
}: {
  vendors: MedicineVendorRow[];
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<VendorDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function startNew() {
    setEditingId(null);
    setCreating(true);
    setDraft(emptyDraft());
    setOpen(true);
    setMsg(null);
  }

  function startEdit(v: MedicineVendorRow) {
    setEditingId(v.id);
    setDraft(fromRow(v));
    setOpen(true);
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const url = editingId ? `/api/vendors/${editingId}` : "/api/vendors";
      const method = editingId ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed");
      setMsg({ ok: true, text: editingId ? "Vendor updated." : "Vendor added." });
      onUpdated();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this vendor permanently?")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    onUpdated();
  }

  const f = (key: keyof VendorDraft) => ({
    value: draft[key],
    onChange: (v: string) => setDraft((d) => ({ ...d, [key]: v })),
  });

  return (
    <>
      {/* trigger buttons */}
      <div className="flex items-center gap-2">
        <button onClick={startNew} className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 px-3 py-1.5 text-[11px] font-semibold text-aqua-700 transition hover:bg-aqua-50">
          <Plus className="h-3 w-3" /> Add vendor
        </button>
        {vendors.length > 0 && (
          <button onClick={() => { setCreating(false); setOpen(true); }} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50">
            <Edit3 className="h-3 w-3" /> Edit vendors
          </button>
        )}
      </div>

      {/* modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-4 pt-20"
            onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setCreating(false); } }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-aqua-600" />
                  <h2 className="font-display text-[15px] font-bold text-aqua-950">
                    {editingId ? "Edit vendor" : "Manage approved vendors"}
                  </h2>
                </div>
                <button onClick={() => { setOpen(false); setCreating(false); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-5">
                {/* vendor list — only when not editing a specific one */}
                {!editingId && (
                  <div className="mb-4 space-y-2">
                    {vendors.map((v) => (
                      <div key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-[12px]">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">{v.name} — {v.branch}</p>
                          <p className="mt-0.5 text-slate-400">{v.authorizedPerson} · {v.city}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {v.mapsUrl && (
                            <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-aqua-500 hover:bg-aqua-50" title="View location">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button onClick={() => startEdit(v)} className="rounded-lg p-1.5 text-slate-400 hover:bg-aqua-50 hover:text-aqua-600"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => remove(v.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                      <button onClick={startNew} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-aqua-200 py-3 text-[12px] font-semibold text-aqua-700 hover:bg-aqua-50">
                      <Plus className="h-3.5 w-3.5" /> Add new vendor
                    </button>
                  </div>
                )}

                {/* form — shown when editingId is set OR user clicked "Add new" */}
                {(editingId || creating || draft.name !== "" || !vendors.length) ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua-600">
                      {editingId ? `Editing ${draft.name}` : "New vendor details"}
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <VoiceField label="Vendor / pharmacy name *" placeholder="e.g. Shaheen Chemist" {...f("name")} />
                      <VoiceField label="Branch *" placeholder="e.g. Blue Area" {...f("branch")} />
                      <VoiceField label="Authorized person *" placeholder="Full name" {...f("authorizedPerson")} />
                      <VoiceField label="License no." placeholder="ICT-PH-1234" {...f("licenseNo")} />
                      <VoiceField label="Email *" placeholder="orders@example.com" type="email" {...f("email")} />
                      <VoiceField label="Phone" placeholder="+92 51 …" {...f("phone")} />
                      <div className="sm:col-span-2"><VoiceField label="Address *" placeholder="Full address" {...f("address")} /></div>
                      <VoiceField label="City *" placeholder="Islamabad" {...f("city")} />
                      <VoiceField label="Google Maps URL" placeholder="https://…" {...f("mapsUrl")} />
                    </div>

                    {msg && (
                      <p className={`rounded-lg px-3 py-2 text-[11px] font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                        {msg.ok && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}{msg.text}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={save}
                        disabled={saving || !draft.name || !draft.branch || !draft.email || !draft.authorizedPerson || !draft.address || !draft.city}
                        className="inline-flex items-center gap-2 rounded-full bg-aqua-600 px-5 py-2 text-[12px] font-semibold text-white transition hover:bg-aqua-700 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        {editingId ? "Update" : "Add vendor"}
                      </button>
                      {editingId && (
                        <button onClick={() => { setEditingId(null); setCreating(false); setDraft(emptyDraft()); setMsg(null); }} className="text-[12px] font-medium text-slate-500 hover:text-aqua-700">
                          ← Back to list
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
