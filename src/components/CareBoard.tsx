"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownWideNarrow, FlaskConical, Pill, ScanLine, Shuffle, Clock3 } from "lucide-react";
import type { LabTest, Medicine } from "@/lib/types";
import { formatPKR } from "@/lib/regions";
import { Chip } from "@/components/ui";

function PriceBar({ rank, name, sub, price, max, hue, delay, note }: { rank: number; name: string; sub: string; price: number; max: number; hue: string; delay: number; note: string; }) {
  const pct = price <= 0 ? 0 : Math.max(6, (Math.log10(price) / Math.log10(Math.max(10, max))) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="group rounded-xl border border-transparent p-2.5 transition hover:border-aqua-100 hover:bg-aqua-50/50"
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-800">
          <span className="font-display w-4 text-right text-[10px] font-bold text-slate-300">{rank}</span>
          <span className="truncate">{name}</span>
        </p>
        <p className="font-display shrink-0 text-[12px] font-bold text-aqua-800">{price > 0 ? formatPKR(price) : "Free"}</p>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-aqua-50">
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${hue}66, ${hue})` }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: delay + 0.08, duration: 0.6 }} />
      </div>
      <p className="mt-1 flex justify-between gap-2 text-[10px] text-slate-400">
        <span className="truncate">{sub}</span>
        <span className="hidden truncate italic group-hover:block sm:block sm:opacity-0 sm:group-hover:opacity-100">{note}</span>
      </p>
    </motion.div>
  );
}

export default function CareBoard({ medicines, tests, imaging, differential, hue, diseaseName }: { medicines: Medicine[]; tests: LabTest[]; imaging: string[]; differential: string[]; hue: string; diseaseName: string; }) {
  const medsDesc = useMemo(() => [...medicines].sort((a, b) => b.price - a.price), [medicines]);
  const testsDesc = useMemo(() => [...tests].sort((a, b) => b.price - a.price), [tests]);
  const maxMed = Math.max(10, ...medsDesc.map((m) => m.price));
  const maxTest = Math.max(10, ...testsDesc.map((t) => t.price));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Pill className="h-3.5 w-3.5" /> Medicines</p>
            <h3 className="font-display mt-1 text-[16px] font-bold text-aqua-950">Price index — {diseaseName}</h3>
          </div>
          <Chip><ArrowDownWideNarrow className="h-3 w-3" /> High→Low</Chip>
        </div>
        <div className="mt-4 space-y-1" key={diseaseName}>
          {medsDesc.map((m, i) => <PriceBar key={m.name} rank={i + 1} name={m.name} sub={`${m.brand} · ${m.form}`} note={m.note} price={m.price} max={maxMed} hue={hue} delay={i * 0.04} />)}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><FlaskConical className="h-3.5 w-3.5" /> Lab Tests</p>
            <Chip><ArrowDownWideNarrow className="h-3 w-3" /> Desc</Chip>
          </div>
          <div className="mt-4 space-y-1" key={diseaseName + "-t"}>
            {testsDesc.map((t, i) => <PriceBar key={t.name} rank={i + 1} name={t.name} sub={t.purpose} note="" price={t.price} max={maxTest} hue={hue} delay={i * 0.04} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {testsDesc.slice(0, 4).map((t) => (
              <span key={t.name} className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-500"><Clock3 className="h-3 w-3 text-aqua-500" /> {t.turnaround}</span>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><ScanLine className="h-3.5 w-3.5" /> Imaging</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{imaging.map((im) => <Chip key={im}>{im}</Chip>)}</div>
          <p className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600"><Shuffle className="h-3.5 w-3.5" /> Differential</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{differential.map((d) => <Chip key={d} tone="slate">{d}</Chip>)}</div>
        </div>
      </div>
    </div>
  );
}
