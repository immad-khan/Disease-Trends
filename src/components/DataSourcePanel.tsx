"use client";

import { useState } from "react";
import { BadgeCheck, CircleAlert, Database, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";

const VERIFIED = [
  { m: "Polio WPV1 — 2024 / 2025 / 2026", v: "74 · 31 · 3", s: "Polio Programme + GPEI" },
  { m: "Polio province 2025", v: "KP 20 · Sindh 9", s: "poliofreepakistan.gov.pk" },
  { m: "Dengue 2019–2024", v: "52k → 79k → 15k", s: "NIH Pakistan" },
  { m: "TB incidence", v: "≈648k/yr", s: "WHO + NTP" },
  { m: "Malaria flood surge", v: "531k → 2.1M", s: "DoMC + WHO" },
  { m: "Hep C pool", v: "7–9M", s: "National Survey" },
];

export default function DataSourcePanel({ onImported }: { onImported: () => void }) {
  const [csv, setCsv] = useState(`disease,year,region,cases,deaths
dengue,2026,punjab,1840,4
dengue,2026,sindh,760,2
dengue,2026,kp,910,2
dengue,2026,balochistan,180,0
dengue,2026,gb,40,0
dengue,2026,ajk,95,1
dengue,2026,ict,434,0`);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/import", { method: "POST", headers: { "content-type": "text/csv" }, body: csv });
      const j = await r.json();
      if (j.ok) { setMsg({ ok: true, text: `${j.written} rows written.` }); onImported(); }
      else setMsg({ ok: false, text: j.error });
    } catch { setMsg({ ok: false, text: "Network error" }); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Database className="h-3.5 w-3.5" /> Provenance</p>
        <h3 className="font-display mt-1 text-[16px] font-bold text-aqua-950">Is this data real?</h3>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-500"><b className="text-aqua-900">Yes, with one caveat.</b> National annual totals are real published numbers. Province splits for non-polio diseases are modelled from share weights because Pakistan publishes national totals.</p>
        <div className="mt-4 space-y-1.5">
          {VERIFIED.map((v) => (
            <div key={v.m} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-[11px]">
              <span className="font-semibold text-slate-700">{v.m}</span>
              <span className="font-display font-bold text-emerald-700">{v.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-aqua-50/70 p-3 text-[11px] leading-relaxed text-aqua-900">
          <b>OGDCL tip:</b> Use the importer to overlay your camp clinic data — all charts & map read from DB instantly.
        </div>
      </div>

      <div className="card flex flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Upload className="h-3.5 w-3.5" /> CSV Importer</p>
        <h3 className="font-display mt-1 text-[16px] font-bold text-aqua-950">Override with your data</h3>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
          <FileSpreadsheet className="h-3.5 w-3.5 text-aqua-500" /> disease,year,region,cases,deaths
        </div>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} spellCheck={false} className="mt-3 min-h-[200px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-aqua-400 focus:bg-white" />
        <div className="mt-3 flex gap-2">
          <button onClick={submit} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-aqua-600 px-5 py-2 text-[12px] font-semibold text-white hover:bg-aqua-700 disabled:opacity-60">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Import
          </button>
          <a href="/api/stats?disease=dengue" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-500 hover:border-aqua-300">Inspect API <Download className="h-3 w-3" /></a>
        </div>
        {msg && <p className={`mt-3 rounded-lg px-3 py-2 text-[11px] font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
