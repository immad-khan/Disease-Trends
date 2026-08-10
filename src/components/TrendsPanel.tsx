"use client";

import { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { YEARS, formatCompact } from "@/lib/regions";
import type { RegionStat } from "@/lib/types";
import { ChartSpline, PieChart as PieIcon } from "lucide-react";

const PIE_COLORS = ["#0e7f9e", "#22b8cf", "#5eead4", "#7dd7e8", "#40bcd6", "#b3e9f2", "#166780"];

function Tip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-aqua-100 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(11,44,58,0.14)] backdrop-blur">
      <p className="font-display text-xs font-bold text-aqua-950">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <b className="font-display text-aqua-950">{Number(p.value).toLocaleString("en-PK")}</b>
        </p>
      ))}
    </div>
  );
}

export default function TrendsPanel({
  stats,
  year,
  hue,
  diseaseName,
}: {
  stats: RegionStat[];
  year: number;
  hue: string;
  diseaseName: string;
}) {
  const series = useMemo(() => {
    return YEARS.map((y) => {
      const rows = stats.filter((s) => s.year === y);
      return {
        year: y,
        Cases: rows.reduce((a, r) => a + r.cases, 0),
        Deaths: rows.reduce((a, r) => a + r.deaths, 0),
      };
    });
  }, [stats]);

  const pieData = useMemo(() => {
    const rows = stats.filter((s) => s.year === year && s.cases > 0).sort((a, b) => b.cases - a.cases);
    return rows.map((r) => ({ name: r.regionName, value: r.cases }));
  }, [stats, year]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_340px]">
      <div className="card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
              <ChartSpline className="h-3.5 w-3.5" /> Decadal Signal · {diseaseName}
            </p>
            <h3 className="font-display mt-1 text-[16px] font-bold text-aqua-950">National cases vs deaths</h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: hue }} /> Cases
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-300" /> Deaths
            </span>
          </div>
        </div>
        <div className="mt-4 h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="caseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hue} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={hue} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e4f2f6" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={{ stroke: "#d9edf3" }} tickMargin={8} />
              <YAxis
                yAxisId="c"
                width={48}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatCompact(v)}
              />
              <YAxis
                yAxisId="d"
                orientation="right"
                width={46}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatCompact(v)}
              />
              <Tooltip content={<Tip />} />
              <Bar yAxisId="d" dataKey="Deaths" fill="#94b8c4" radius={[4, 4, 0, 0]} barSize={14} opacity={0.75} />
              <Area
                yAxisId="c"
                type="monotone"
                dataKey="Cases"
                stroke={hue}
                strokeWidth={3}
                fill="url(#caseGrad)"
                animationDuration={900}
                dot={{ r: 3, fill: hue, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: hue, stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
          <PieIcon className="h-3.5 w-3.5" /> Region Share · {year}
        </p>
        <div className="relative mt-3 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2.5}
                cornerRadius={5}
                animationDuration={800}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Regions</p>
              <p className="font-display text-2xl font-bold text-aqua-950">{pieData.length}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {pieData.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
