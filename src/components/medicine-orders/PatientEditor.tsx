"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, CheckCircle2, Edit3, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import type { PatientRow } from "@/db/schema";
import { VoiceField } from "./VoiceField";

interface PatientDraft {
  medicalRecordNo: string;
  fullName: string;
  city: string;
  email: string;
  phone: string;
  allergies: string;
}

function emptyDraft(): PatientDraft {
  return { medicalRecordNo: "", fullName: "", city: "", email: "", phone: "", allergies: "" };
}

function fromRow(p: PatientRow): PatientDraft {
  return {
    medicalRecordNo: p.medicalRecordNo ?? "",
    fullName: p.fullName,
    city: p.city ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    allergies: Array.isArray(p.allergies) ? p.allergies.join(", ") : (p.allergies as string) ?? "",
  };
}

export default function PatientEditor({
  patients,
  onUpdated,
}: {
  patients: PatientRow[];
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<PatientDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function startNew() {
    setEditingId(null);
    setCreating(true);
    setDraft(emptyDraft());
    setOpen(true);
    setMsg(null);
  }

  function startEdit(p: PatientRow) {
    setEditingId(p.id);
    setDraft(fromRow(p));
    setOpen(true);
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const url = editingId ? `/api/patients/${editingId}` : "/api/patients";
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...draft,
        allergies: draft.allergies.split(",").map(a => a.trim()).filter(Boolean)
      };
      const r = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed");
      setMsg({ ok: true, text: editingId ? "Patient updated." : "Patient added." });
      onUpdated();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this patient permanently?")) return;
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    onUpdated();
  }

  const f = (key: keyof PatientDraft) => ({
    value: draft[key],
    onChange: (v: string) => setDraft((d) => ({ ...d, [key]: v })),
  });

  return (
    <>
      {/* trigger buttons */}
      <div className="flex items-center gap-2">
        <button onClick={startNew} className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 px-3 py-1.5 text-[11px] font-semibold text-aqua-700 transition hover:bg-aqua-50">
          <Plus className="h-3 w-3" /> Add patient
        </button>
        {patients.length > 0 && (
          <button onClick={() => { setCreating(false); setOpen(true); }} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50">
            <Edit3 className="h-3 w-3" /> Edit patients
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
                  <UserRound className="h-4 w-4 text-aqua-600" />
                  <h2 className="font-display text-[15px] font-bold text-aqua-950">
                    {editingId ? "Edit patient" : "Manage patients"}
                  </h2>
                </div>
                <button onClick={() => { setOpen(false); setCreating(false); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-5">
                {/* patient list — only when not editing a specific one */}
                {!editingId && (
                  <div className="mb-4 space-y-2">
                    {patients.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-[12px]">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">{p.fullName} — {p.medicalRecordNo}</p>
                          <p className="mt-0.5 text-slate-400">{p.email} · {p.phone}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-aqua-50 hover:text-aqua-600"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                      <button onClick={startNew} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-aqua-200 py-3 text-[12px] font-semibold text-aqua-700 hover:bg-aqua-50">
                      <Plus className="h-3.5 w-3.5" /> Add new patient
                    </button>
                  </div>
                )}

                {/* form — shown when editingId is set OR user clicked "Add new" */}
                {(editingId || creating || draft.fullName !== "" || !patients.length) ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua-600">
                      {editingId ? `Editing ${draft.fullName}` : "New patient details"}
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <VoiceField label="Patient Full Name *" placeholder="e.g. John Doe" {...f("fullName")} />
                      <VoiceField label="Medical Record No" placeholder="Leave blank to auto-generate" {...f("medicalRecordNo")} />
                      <VoiceField label="Email *" placeholder="patient@example.com" type="email" {...f("email")} />
                      <VoiceField label="Phone *" placeholder="+92 51 …" {...f("phone")} />
                      <VoiceField label="City *" placeholder="Islamabad" {...f("city")} />
                      <VoiceField label="Allergies" placeholder="Comma separated, e.g. Penicillin" {...f("allergies")} />
                    </div>

                    {msg && (
                      <p className={`rounded-lg px-3 py-2 text-[11px] font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                        {msg.ok && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}{msg.text}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={save}
                        disabled={saving || !draft.fullName || !draft.email || !draft.phone || !draft.city}
                        className="inline-flex items-center gap-2 rounded-full bg-aqua-600 px-5 py-2 text-[12px] font-semibold text-white transition hover:bg-aqua-700 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        {editingId ? "Update" : "Add patient"}
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
