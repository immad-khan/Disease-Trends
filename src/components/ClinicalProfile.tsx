"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText, CircleAlert, Dna, FileBadge, FlaskConical, GitBranch, Globe2,
  HeartPulse, ListChecks, Microscope, ShieldCheck, Stethoscope, type LucideIcon,
} from "lucide-react";
import type { DiseasePayload } from "@/lib/types";
import { diseaseIcon } from "@/lib/icons";
import { Chip } from "@/components/ui";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-slate-600">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-400" />
          {it}
        </li>
      ))}
    </ul>
  );
}

interface Section {
  id: string; n: string; title: string; icon: LucideIcon;
}

const SECTIONS: Section[] = [
  { id: "identity", n: "01", title: "Identity", icon: FileBadge },
  { id: "cause", n: "02", title: "Cause", icon: Dna },
  { id: "risk", n: "03", title: "Risk Factors", icon: CircleAlert },
  { id: "mechanism", n: "04", title: "Mechanism", icon: GitBranch },
  { id: "targets", n: "05", title: "Organs & Biomarkers", icon: Microscope },
  { id: "symptoms", n: "06", title: "Signs & Symptoms", icon: Stethoscope },
  { id: "stages", n: "07", title: "Stages", icon: HeartPulse },
  { id: "epi", n: "08", title: "Epidemiology", icon: Globe2 },
  { id: "diagnosis", n: "09", title: "Diagnosis", icon: FlaskConical },
  { id: "management", n: "10", title: "Treatment", icon: ShieldCheck },
];

export default function ClinicalProfile({ d }: { d: DiseasePayload }) {
  const [active, setActive] = useState("identity");
  useEffect(() => setActive("identity"), [d.slug]);
  const DIcon = diseaseIcon(d.icon);

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      {/* mobile: horizontal pill nav, desktop: vertical */}
      <aside className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-aqua-600 via-aqua-500 to-teal-400 p-4 text-white">
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15"><DIcon className="h-4 w-4" /></span>
            <div className="min-w-0">
              <h3 className="font-display truncate text-[13px] font-bold">{d.name}</h3>
              <p className="truncate text-[10px] text-aqua-50/90">ICD {d.icd} · {d.severity}/10</p>
            </div>
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto p-2 lg:block lg:space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition lg:w-full ${
                active === s.id ? "bg-aqua-50 text-aqua-800" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={`font-display text-[9px] ${active === s.id ? "text-aqua-500" : "text-slate-300"}`}>{s.n}</span>
              <s.icon className={`h-3.5 w-3.5 ${active === s.id ? "text-aqua-600" : "text-slate-300"}`} />
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      <div className="card p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={d.slug + active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">Section {SECTIONS.find((s) => s.id === active)?.n}</p>
            <h3 className="font-display mb-4 mt-1 text-[18px] font-bold text-aqua-950">{SECTIONS.find((s) => s.id === active)?.title}</h3>

            {active === "identity" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-aqua-100 bg-aqua-50 p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua-700">ICD-10</p><p className="font-display mt-1 text-sm font-bold">{d.icd}</p></div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">ICD-11</p><p className="font-display mt-1 text-sm font-bold">{d.icd11 ?? "—"}</p></div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Category</p><p className="mt-1 text-[12px] font-semibold">{d.category}</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Acronyms</p><div className="mt-2 flex flex-wrap gap-1.5">{d.acronyms.map((a) => <Chip key={a}>{a}</Chip>)}</div></div>
                  <div><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Synonyms</p><div className="mt-2 flex flex-wrap gap-1.5">{d.synonyms.map((a) => <Chip key={a} tone="slate">{a}</Chip>)}</div></div>
                </div>
                <p className="rounded-xl bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-600">{d.taxonomy}</p>
              </div>
            )}
            {active === "cause" && (
              <div className="space-y-4">
                <div className="rounded-xl border-l-4 border-l-aqua-500 bg-aqua-50/60 p-4 text-[13px] leading-relaxed text-slate-700">{d.cause}</div>
                <Bullets items={d.transmission} />
                <p className="rounded-xl bg-slate-50 p-3 text-[12px] text-slate-600"><b>Incubation:</b> {d.incubation}</p>
              </div>
            )}
            {active === "risk" && <Bullets items={d.riskFactors} />}
            {active === "mechanism" && (
              <ol className="relative space-y-3 border-l-2 border-aqua-100 pl-6">
                {d.mechanism.map((m, i) => (
                  <li key={i} className="relative"><span className="font-display absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full bg-aqua-600 text-[10px] font-bold text-white ring-4 ring-white">{i + 1}</span><p className="text-[12.5px] leading-relaxed text-slate-600">{m}</p></li>
                ))}
              </ol>
            )}
            {active === "targets" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Organs</p><div className="mt-2 flex flex-wrap gap-1.5">{d.organs.map((o) => <Chip key={o}>{o}</Chip>)}</div></div>
                <div><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Biomarkers</p><div className="mt-2"><Bullets items={d.biomarkers} /></div></div>
              </div>
            )}
            {active === "symptoms" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-aqua-100 p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua-700">Signs</p><div className="mt-2"><Bullets items={d.signs} /></div></div>
                <div className="rounded-xl border border-slate-100 p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Symptoms</p><div className="mt-2"><Bullets items={d.symptoms} /></div></div>
              </div>
            )}
            {active === "stages" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {d.stages.map((s, i) => (
                  <div key={s.name} className="rounded-xl border border-slate-100 p-4"><p className="font-display text-[13px] font-bold">{i + 1}. {s.name}</p><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aqua-600">{s.window}</p><p className="mt-1 text-[12px] leading-relaxed text-slate-600">{s.desc}</p></div>
                ))}
              </div>
            )}
            {active === "epi" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-aqua-50/70 p-4 text-[12px] leading-relaxed text-slate-600">{d.prevalence}</div><div className="rounded-xl bg-aqua-50/70 p-4 text-[12px] leading-relaxed text-slate-600">{d.incidence}</div></div>
                <p className="text-[12px] leading-relaxed text-slate-600"><b>Global:</b> {d.global}</p>
                <Bullets items={d.demographics} />
                <p className="rounded-xl bg-slate-50 p-3 text-[12px] text-slate-600">{d.geography}</p>
              </div>
            )}
            {active === "diagnosis" && (
              <div className="space-y-4">
                <div className="rounded-xl border-l-4 border-l-aqua-500 bg-aqua-50/60 p-4 text-[13px] text-slate-700">{d.criteria}</div>
                <div className="flex flex-wrap gap-1.5">{d.imaging.map((i) => <Chip key={i}>{i}</Chip>)}</div>
                <div className="flex flex-wrap gap-1.5">{d.differential.map((i) => <Chip key={i} tone="slate">{i}</Chip>)}</div>
              </div>
            )}
            {active === "management" && (
              <div className="space-y-4">
                <div><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"><ListChecks className="h-3.5 w-3.5 text-aqua-500" /> Therapies</p><div className="mt-2"><Bullets items={d.treatment} /></div></div>
                <div><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-aqua-500" /> Prevention</p><div className="mt-2"><Bullets items={d.prevention} /></div></div>
                <div className="rounded-xl bg-gradient-to-br from-aqua-600 to-teal-500 p-4 text-white text-[12.5px] leading-relaxed">{d.prognosis}</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
