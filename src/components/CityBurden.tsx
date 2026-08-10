"use client";

import { useEffect, useState } from "react";
import { MapPin, Users, Droplets } from "lucide-react";
import { CITIES, CITY_BY_DISEASE } from "@/data/cities";
import { diseaseIcon } from "@/lib/icons";
import type { CityBurden } from "@/lib/types";
import { Chip } from "@/components/ui";

const meta: Record<string, { hue: string; icon: string; name: string }> = {
  dengue: { hue: "#06b6d4", icon: "bug", name: "Dengue" },
  malaria: { hue: "#0ea5e9", icon: "droplets", name: "Malaria" },
  tuberculosis: { hue: "#14b8a6", icon: "lungs", name: "TB" },
  typhoid: { hue: "#0891b2", icon: "thermometer", name: "Typhoid" },
  "hepatitis-c": { hue: "#22d3ee", icon: "activity", name: "Hep C" },
  poliomyelitis: { hue: "#2dd4bf", icon: "syringe", name: "Polio" },
  "covid-19": { hue: "#67e8f9", icon: "virus", name: "COVID-19" },
  measles: { hue: "#5eead4", icon: "scan", name: "Measles" },
};

export default function CityBurdenPanel({
  diseaseSlug,
  onSelect,
}: {
  diseaseSlug: string;
  onSelect: (slug: string) => void;
}) {
  const [view, setView] = useState<"byCity" | "byDisease">("byCity");
  const cities = view === "byCity" ? CITIES : CITY_BY_DISEASE[diseaseSlug] ?? [];

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-aqua-600">
              <MapPin className="h-3.5 w-3.5" /> City-Level Intelligence — Pakistan Value
            </p>
            <h3 className="font-display mt-1 text-[18px] font-bold text-aqua-950">
              In which city which disease is most?
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
            <button
              onClick={() => setView("byCity")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                view === "byCity" ? "bg-white text-aqua-700 shadow" : "text-slate-500"
              }`}
            >
              All cities
            </button>
            <button
              onClick={() => setView("byDisease")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                view === "byDisease" ? "bg-white text-aqua-700 shadow" : "text-slate-500"
              }`}
            >
              For {meta[diseaseSlug]?.name ?? diseaseSlug}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c: CityBurden) => {
            const m = meta[c.topDiseaseSlug] ?? { hue: "#0891b2", icon: "activity", name: c.topDisease };
            const Icon = diseaseIcon(m.icon);
            return (
              <button
                key={c.city}
                onClick={() => onSelect(c.topDiseaseSlug)}
                className="group rounded-xl border border-slate-100 p-3 text-left transition hover:border-aqua-200 hover:bg-aqua-50/40"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-display truncate text-[13px] font-bold text-aqua-950">{c.city}</p>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Users className="h-3 w-3" /> {(c.population / 1_000_000).toFixed(2)}M · {c.province.toUpperCase()}
                    </p>
                  </div>
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white"
                    style={{ background: m.hue }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Chip>{m.name}</Chip>
                  <span className="truncate text-[10px] text-slate-500">{c.casesShare}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-slate-500">
                  {c.environment}
                </p>
              </button>
            );
          })}
        </div>

        {view === "byDisease" && cities.length === 0 && (
          <p className="mt-4 text-center text-[12px] text-slate-400">
            No city mapped as top for this disease — switch to All cities or pick another pathogen.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua-600">
            <Droplets className="h-3.5 w-3.5" /> How to read this
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
            Each city card shows the disease that consistently drives its public-health load. Karachi is malaria
            post-flood, Lahore dengue monsoon, Quetta & Faisalabad TB due to crowding, Larkana & Okara Hep C from unsafe
            injections, Hyderabad XDR typhoid from sewage cross-connection, Bannu / DI Khan polio due to missed children.
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Data derived from NIH weekly, district DHIS2 aggregates, and published geospatial studies — city = sentinel for
            province ecology, not exclusive.
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Use it</p>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
            For OGDCL field operations: match your camp location to this matrix. Dadu/Sukkur = pack LLINs + praziquantel,
            Lahore/Islamabad camps = Aedes source-reduction checklists, southern KP = verify polio & measles vaccination
            at crew induction. Tap any card to jump that disease in the 3D atlas.
          </p>
        </div>
      </div>
    </div>
  );
}
