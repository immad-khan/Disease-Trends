"use client";

import { Droplets, Thermometer, Wind, Waves, Building2, Bug, CloudRain, Sun } from "lucide-react";
import type { EnvironmentInfo } from "@/lib/types";
import { Chip } from "@/components/ui";

export default function EnvironmentPanel({
  env,
  diseaseName,
  hue,
}: {
  env: EnvironmentInfo | null | undefined;
  diseaseName: string;
  hue: string;
}) {
  if (!env) {
    return (
      <div className="card p-6">
        <p className="text-sm text-slate-500">Environment data not available for {diseaseName}.</p>
      </div>
    );
  }

  const tiles = [
    { label: "Climate", value: env.climate, Icon: Sun },
    { label: "Temperature", value: env.temperature, Icon: Thermometer },
    { label: "Humidity", value: env.humidity, Icon: Droplets },
    { label: "Terrain", value: env.terrain, Icon: Waves },
    { label: "Water & Sanitation", value: env.waterSanitation, Icon: Building2 },
    { label: "Seasonality", value: env.seasonality, Icon: CloudRain },
    { label: "Urban / Rural", value: env.urbanRural, Icon: Wind },
    { label: "Carrying medium", value: env.carryingMedium, Icon: Bug },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
          <Wind className="h-3.5 w-3.5" /> Environmental Niche
        </p>
        <h3 className="font-display mt-1 text-[18px] font-bold text-aqua-950">
          How {diseaseName} spreads in Pakistan — where and when
        </h3>
        <p className="mt-3 rounded-xl border-l-4 p-4 text-[13px] leading-relaxed text-slate-700" style={{ borderColor: hue, background: `${hue}12` }}>
          {env.description}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-slate-100 p-3">
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <t.Icon className="h-3 w-3 text-aqua-500" /> {t.label}
              </p>
              <p className="mt-1.5 text-[12px] font-medium leading-snug text-slate-700">{t.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Environmental risk amplifiers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {env.riskFactors.map((r) => (
              <Chip key={r}>{r}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Pakistan value contrast */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Pakistan context</p>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
            Pakistan ranks <b className="text-aqua-900">6th most climate-vulnerable</b> globally (Germanwatch). Monsoon variability
            (+40% vs -40%), glacial melt, and 44% urban population with only 27% safely managed sanitation create overlapping
            disease ecologies: flood→malaria, urban tanks→dengue, open drains→polio/typhoid, crowding→TB/measles.
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">OGDCL relevance</p>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
            For field camps: enforce <b>single-use injection policy</b>, screened water (chlorination), covered storage, LLINs in
            Sindh/Balochistan, and measles/typhoid vaccination at induction. The CSV importer lets you overlay camp clinic data
            onto national trends instantly.
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-aqua-600 to-teal-500 p-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua-100">Why environment matters</p>
          <p className="mt-2 text-[12.5px] leading-relaxed">
            Control is 80% environment, 20% medicine. Dengue drops 70% when overhead tanks are covered weekly. Malaria halves with
            pre-monsoon larviciding. Polio needs sewage, not just vaccine — 608 positive sewage samples in 2025 mapped the risk.
          </p>
        </div>
      </div>
    </div>
  );
}
