"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid2x2Check, MapPin, MousePointerClick, Pause, Play } from "lucide-react";
import type { RegionKey, RegionStat } from "@/lib/types";
import { REGIONS, YEARS, YEAR_STATUS, formatCompact } from "@/lib/regions";
import { useCountUp } from "@/hooks/useCountUp";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { Sparkles } from "lucide-react";

const PakistanMap3D = dynamic(() => import("@/components/three/PakistanMap3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-aqua-600">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-aqua-200 border-t-aqua-600" />
        <span className="text-[11px] font-medium">Building 145 districts…</span>
      </div>
    </div>
  ),
});

const LABELS = Object.fromEntries(
  REGIONS.map((r) => [r.key, { name: r.name, abbr: r.abbr }])
) as Record<string, { name: string; abbr: string }>;

export default function AtlasCore({
  stats,
  year,
  onYearChange,
  diseaseName,
  hue,
}: {
  stats: RegionStat[];
  year: number;
  onYearChange: (y: number) => void;
  diseaseName: string;
  hue: string;
}) {
  const [hovered, setHovered] = useState<RegionKey | null>(null);
  const [playing, setPlaying] = useState(false);
  const [districts, setDistricts] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapHostRef = useRef<HTMLDivElement | null>(null);
  const mapReady = useDeferredMount({ timeout: 500, rootRef: mapHostRef });

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        onYearChange(year >= YEARS[YEARS.length - 1] ? YEARS[0] : year + 1);
      }, 1300);
    } else if (timer.current) clearInterval(timer.current);
    return () => void (timer.current && clearInterval(timer.current));
  }, [playing, year, onYearChange]);

  const yearRows = useMemo(
    () => stats.filter((s) => s.year === year).sort((a, b) => b.cases - a.cases),
    [stats, year]
  );
  const values = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of yearRows) m[r.region] = r.cases;
    return m;
  }, [yearRows]);

  const totalCases = yearRows.reduce((a, r) => a + r.cases, 0);
  const totalDeaths = yearRows.reduce((a, r) => a + r.deaths, 0);
  const top = yearRows[0];
  const maxCases = Math.max(1, ...yearRows.map((r) => r.cases));
  const cTotal = useCountUp(totalCases);
  const cDeaths = useCountUp(totalDeaths);
  const hoverStat = hovered ? yearRows.find((r) => r.region === hovered) : null;
  const status = YEAR_STATUS[year] ?? "final";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_300px]">
      {/* map */}
      <div className="card relative overflow-hidden">
        <div className="absolute left-3 top-3 z-10 flex items-start justify-between gap-3 max-[640px]:right-3 max-[640px]:flex-col sm:left-4 sm:top-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
              145 districts · true boundaries
            </p>
            <h3 className="font-display mt-0.5 flex flex-wrap items-center gap-2 text-[15px] font-bold text-aqua-950 sm:text-[16px]">
              {diseaseName} · {year}
              {status !== "final" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wide ${
                    status === "ytd" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {status === "ytd" ? "YTD" : "Prov."}
                </span>
              )}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setDistricts((d) => !d)}
          className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${
            districts ? "border-aqua-300 bg-aqua-50 text-aqua-700" : "border-slate-200 bg-white text-slate-400"
          } sm:right-4`}
          style={{ top: "3.2rem" }}
        >
          <Grid2x2Check className="h-3 w-3" /> Districts
        </button>

        <div ref={mapHostRef} className="relative h-[380px] w-full overflow-hidden sm:h-[460px] lg:h-[520px]">
          {mapReady ? (
            <>
              <PakistanMap3D
                values={values}
                hovered={hovered}
                onHover={setHovered}
                onSelect={(k) => setHovered(k)}
                labels={LABELS}
                showDistricts={districts}
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-3 h-24 rounded-[100%] bg-aqua-200/20 blur-2xl" />
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-aqua-50 via-white to-aqua-100">
              <div className="dot-grid absolute inset-0 opacity-40" />
              <div className="relative flex flex-col items-center gap-3 text-aqua-600">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(11,44,58,0.12)]">
                  <Sparkles className="h-6 w-6 animate-pulse text-aqua-500" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide text-aqua-700">
                  Preparing interactive 3D map…
                </span>
                <span className="text-[10px] text-slate-400">Loaded after the rest of the page for a faster start</span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 z-10 right-3 flex justify-between gap-3 sm:bottom-4 sm:left-4 sm:right-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={hoverStat ? hoverStat.region : "none"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-aqua-100 bg-white/90 px-3 py-2 shadow-[0_10px_26px_rgba(11,44,58,0.1)] backdrop-blur"
            >
              {hoverStat ? (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua-600">
                      {hoverStat.regionName}
                    </p>
                    <p className="font-display text-[15px] font-bold leading-tight text-aqua-950">
                      {hoverStat.cases.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-aqua-100" />
                  <div className="text-[10px] leading-tight text-slate-500">
                    <div>{totalCases > 0 ? ((hoverStat.cases / totalCases) * 100).toFixed(1) : "0"}% share</div>
                    <div>{hoverStat.deaths.toLocaleString()} deaths</div>
                  </div>
                </div>
              ) : (
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <MousePointerClick className="h-3.5 w-3.5 text-aqua-500" />
                  Hover province · drag to orbit · scroll to zoom
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="hidden items-end gap-1 text-[9px] text-slate-400 sm:flex">
            <span>low</span>
            <span className="h-2 w-20 rounded-full bg-gradient-to-r from-aqua-100 via-aqua-300 to-aqua-700" />
            <span>high</span>
          </div>
        </div>
      </div>

      {/* right column */}
      <div className="flex flex-col gap-3">
        <div className="card grid grid-cols-2 gap-3 p-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Cases {year}</p>
            <p className="font-display mt-1 text-[20px] font-bold leading-none text-aqua-950">
              {cTotal.toLocaleString("en-PK")}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Deaths</p>
            <p className="font-display mt-1 text-[20px] font-bold leading-none text-aqua-950">
              {cDeaths.toLocaleString("en-PK")}
            </p>
          </div>
          {top && (
            <div className="col-span-2 rounded-lg border border-aqua-100 bg-aqua-50/70 px-3 py-2">
              <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua-700">
                <MapPin className="h-3 w-3" /> Highest burden
              </p>
              <p className="mt-0.5 text-[12px] font-semibold text-aqua-950">
                {top.regionName} — {formatCompact(top.cases)}
                <span className="ml-1 font-normal text-slate-500">
                  ({totalCases > 0 ? ((top.cases / totalCases) * 100).toFixed(0) : 0}%)
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Timeline 2015–2026
            </p>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1 rounded-full bg-aqua-600 px-3 py-1 text-[10px] font-semibold text-white transition hover:bg-aqua-700"
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {playing ? "Pause" : "Play"}
            </button>
          </div>
          <input
            type="range"
            className="scrub mt-3"
            min={YEARS[0]}
            max={YEARS[YEARS.length - 1]}
            step={1}
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            style={{ ["--fill" as string]: `${((year - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * 100}%` }}
          />
          <div className="mt-2 grid grid-cols-6 gap-1 sm:flex sm:justify-between">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`rounded px-1 py-0.5 text-[10px] font-medium transition ${
                  y === year ? "bg-aqua-600 font-bold text-white" : "text-slate-400 hover:text-aqua-600"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="card flex flex-col p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Regional ranking · {year}
          </p>
          <div className="mt-3 space-y-1.5">
            {yearRows.map((r, i) => (
              <button
                key={r.region}
                onMouseEnter={() => setHovered(r.region)}
                onMouseLeave={() => setHovered(null)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                  hovered === r.region ? "bg-aqua-50" : ""
                }`}
              >
                <span className={`font-display w-4 text-right text-[11px] font-bold ${i === 0 ? "text-aqua-600" : "text-slate-300"}`}>
                  {i + 1}
                </span>
                <span className="w-[84px] truncate text-[12px] font-semibold text-slate-700">{r.regionName}</span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-aqua-50">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${hue}88, ${hue})` }}
                    initial={false}
                    animate={{ width: `${Math.max(3, (r.cases / maxCases) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 95, damping: 18 }}
                  />
                </span>
                <span className="font-display w-12 text-right text-[11px] font-bold text-aqua-950">
                  {formatCompact(r.cases)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
