"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar } from "lucide-react";
import { diseaseIcon } from "@/lib/icons";
import { formatCompact } from "@/lib/regions";

interface LeaderRow {
  year: number;
  leader: string | null;
  leaderCases: number;
  ranking: { disease: string; cases: number }[];
}

const diseaseMeta: Record<string, { name: string; hue: string; icon: string }> = {
  dengue: { name: "Dengue", hue: "#06b6d4", icon: "bug" },
  malaria: { name: "Malaria", hue: "#0ea5e9", icon: "droplets" },
  tuberculosis: { name: "TB", hue: "#14b8a6", icon: "lungs" },
  typhoid: { name: "Typhoid", hue: "#0891b2", icon: "thermometer" },
  "hepatitis-c": { name: "Hep C", hue: "#22d3ee", icon: "activity" },
  poliomyelitis: { name: "Polio", hue: "#2dd4bf", icon: "syringe" },
  "covid-19": { name: "COVID-19", hue: "#67e8f9", icon: "virus" },
  measles: { name: "Measles", hue: "#5eead4", icon: "scan" },
};

export default function YearlyLeaders({ onSelect }: { onSelect: (slug: string) => void }) {
  const [data, setData] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/national")
      .then((r) => r.json())
      .then((j) => {
        setData(j.leaders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-6 w-40 animate-pulse rounded bg-aqua-100" />
        <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-aqua-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
            <Trophy className="h-3.5 w-3.5" /> Yearly Dominance
          </p>
          <h3 className="font-display mt-1 text-[17px] font-bold text-aqua-950">
            In which year which disease was highest?
          </h3>
        </div>
        <span className="hidden text-[11px] text-slate-400 sm:block">
          Tap a year card to focus that disease
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {data.map((row, i) => {
          const leader = row.leader ? diseaseMeta[row.leader] : null;
          const Icon = leader ? diseaseIcon(leader.icon) : null;
          return (
            <motion.button
              key={row.year}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => row.leader && onSelect(row.leader)}
              className="group relative overflow-hidden rounded-xl border border-aqua-100 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-[0_8px_20px_rgba(11,44,58,0.08)]"
            >
              {leader && (
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${leader.hue}, transparent)` }}
                />
              )}
              <div className="flex items-center justify-between">
                <span className="font-display flex items-center gap-1 text-[13px] font-extrabold text-aqua-950">
                  <Calendar className="h-3 w-3 text-slate-300" /> {row.year}
                </span>
                {Icon && leader && (
                  <span
                    className="grid h-6 w-6 place-items-center rounded-md text-white"
                    style={{ background: leader.hue }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <p className="font-display mt-2 truncate text-[13px] font-bold text-aqua-900">
                {leader?.name ?? "—"}
              </p>
              <p className="text-[11px] font-medium text-slate-500">{formatCompact(row.leaderCases)} cases</p>
              <div className="mt-2 space-y-1">
                {row.ranking.slice(0, 3).map((r, idx) => (
                  <div key={r.disease} className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">
                      {idx + 1}. {diseaseMeta[r.disease]?.name ?? r.disease}
                    </span>
                    <span className="font-display font-semibold">{formatCompact(r.cases)}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        2015–2019 malaria & TB traded dominance; 2020–21 COVID-19 took over; 2022–23 malaria surged with floods
        reclaiming top; 2024–26 TB re-asserts as endemic baseline while polio stays low but geographically critical.
      </p>
    </div>
  );
}
