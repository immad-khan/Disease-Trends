"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Map as MapIcon,
  Waypoints,
  Wind,
  MapPin,
  CircleDollarSign,
  BookHeart,
  Database,
} from "lucide-react";
import type { DiseasePayload, DiseaseSummary, RegionStat } from "@/lib/types";
import { CURRENT_YEAR, formatCompact } from "@/lib/regions";
import { diseaseIcon } from "@/lib/icons";
import { Brand } from "@/components/Brand";
import AtlasCore from "@/components/AtlasCore";
import TrendsPanel from "@/components/TrendsPanel";
import YearlyLeaders from "@/components/YearlyLeaders";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import CityBurdenPanel from "@/components/CityBurden";
import CareBoard from "@/components/CareBoard";
import ClinicalProfile from "@/components/ClinicalProfile";
import DataSourcePanel from "@/components/DataSourcePanel";
import { Skeleton } from "@/components/ui";

type View = "atlas" | "trends" | "environment" | "cities" | "care" | "clinical" | "data";

const VIEWS: { id: View; label: string; short: string; icon: typeof MapIcon }[] = [
  { id: "atlas", label: "3D Atlas", short: "Atlas", icon: MapIcon },
  { id: "trends", label: "Trends", short: "Trends", icon: Waypoints },
  { id: "environment", label: "Environment", short: "Environ", icon: Wind },
  { id: "cities", label: "Cities", short: "Cities", icon: MapPin },
  { id: "care", label: "Care & Cost", short: "Care", icon: CircleDollarSign },
  { id: "clinical", label: "Clinical", short: "Clinical", icon: BookHeart },
  { id: "data", label: "Data Source", short: "Data", icon: Database },
];

export default function AtlasApp() {
  const [summaries, setSummaries] = useState<DiseaseSummary[]>([]);
  const [slug, setSlug] = useState("dengue");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [view, setView] = useState<View>("atlas");
  const [detail, setDetail] = useState<DiseasePayload | null>(null);
  const [stats, setStats] = useState<RegionStat[]>([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    fetch("/api/diseases")
      .then((r) => r.json())
      .then(setSummaries)
      .catch(() => {});
  }, [nonce]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/diseases/${slug}`).then((r) => r.json()),
      fetch(`/api/stats?disease=${slug}`).then((r) => r.json()),
    ])
      .then(([d, s]) => {
        if (!alive) return;
        setDetail(d);
        setStats(s);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug, nonce]);

  const onYearChange = useCallback((y: number) => setYear(y), []);
  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return (
    <div className="min-h-dvh bg-[#f6fbfc]">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-aqua-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <Brand />
          <div className="hidden items-center gap-4 text-[11px] text-slate-400 md:flex">
            <span>2015–2026 · 145 districts</span>
            <span className="h-3 w-px bg-aqua-100" />
            <span>OGDCL HSE Intelligence</span>
          </div>
        </div>
      </header>

      {/* disease selector — horizontal on mobile, becomes sticky side rail on xl */}
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-6 lg:flex lg:gap-4">
        <aside className="lg:w-[200px] lg:shrink-0">
          <div className="lg:sticky lg:top-[72px]">
            <p className="mb-2 hidden px-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:block">
              Pathogens
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
              {summaries.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-11 w-32 shrink-0 lg:w-full" />
                  ))
                : summaries.map((d) => {
                    const Icon = diseaseIcon(d.icon);
                    const active = slug === d.slug;
                    return (
                      <button
                        key={d.slug}
                        onClick={() => setSlug(d.slug)}
                        className={`group flex w-[148px] shrink-0 items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition lg:w-full ${
                          active
                            ? "border-aqua-300 bg-aqua-50 shadow-[0_4px_14px_rgba(20,127,158,0.12)]"
                            : "border-aqua-100 bg-white hover:border-aqua-200"
                        }`}
                      >
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                          style={{ background: `linear-gradient(135deg, ${d.hue}, #166780)` }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate text-[12px] font-bold ${active ? "text-aqua-900" : "text-slate-700"}`}
                          >
                            {d.shortName}
                          </span>
                          <span className="block truncate text-[9.5px] text-slate-400">
                            {formatCompact(d.cases2024)} · peak {d.peakYear}
                          </span>
                        </span>
                        {active && (
                          <motion.span
                            layoutId="rail-dot"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500"
                          />
                        )}
                      </button>
                    );
                  })}
            </div>
          </div>
        </aside>

        {/* main */}
        <main className="mt-3 min-w-0 flex-1 lg:mt-0">
          {/* view tabs — scrollable on mobile */}
          <div className="sticky top-14 z-30 -mx-3 border-y border-aqua-100 bg-white px-3 sm:mx-0 sm:rounded-xl sm:border">
            <div className="flex items-center gap-1 overflow-x-auto">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 px-3 py-3 text-[12px] font-semibold transition sm:px-4 ${
                    view === v.id ? "text-aqua-800" : "text-slate-400 hover:text-aqua-600"
                  }`}
                >
                  <v.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{v.label}</span>
                  <span className="sm:hidden">{v.short}</span>
                  {view === v.id && (
                    <motion.span
                      layoutId="view-underline"
                      className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-gradient-to-r from-aqua-500 to-teal-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                {!detail ? (
                  <Skeleton className="h-[520px]" />
                ) : view === "atlas" ? (
                  <AtlasCore
                    stats={stats}
                    year={year}
                    onYearChange={onYearChange}
                    diseaseName={detail.name}
                    hue={detail.hue}
                  />
                ) : view === "trends" ? (
                  <div className="space-y-4">
                    <YearlyLeaders onSelect={(s) => setSlug(s)} />
                    <TrendsPanel
                      stats={stats}
                      year={year}
                      hue={detail.hue}
                      diseaseName={detail.shortName}
                    />
                  </div>
                ) : view === "environment" ? (
                  <EnvironmentPanel env={detail.environment} diseaseName={detail.shortName} hue={detail.hue} />
                ) : view === "cities" ? (
                  <CityBurdenPanel diseaseSlug={slug} onSelect={setSlug} />
                ) : view === "care" ? (
                  <CareBoard
                    medicines={detail.medicines}
                    tests={detail.tests}
                    imaging={detail.imaging}
                    differential={detail.differential}
                    hue={detail.hue}
                    diseaseName={detail.shortName}
                  />
                ) : view === "clinical" ? (
                  <ClinicalProfile d={detail} />
                ) : (
                  <DataSourcePanel onImported={refresh} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* footer minimal */}
          <footer className="mt-8 border-t border-aqua-100 py-6 text-center text-[11px] leading-relaxed text-slate-400">
            <p>
              District geometry: Ebtihaj Khan — Peshawar Civic Innovation Lab / Code for Pakistan · Data: NIH, NTP, DoMC,
              EPI, Polio Programme, NCOC, WHO · OGDCL HSE use: overlay camp clinic data via Data Source importer
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
