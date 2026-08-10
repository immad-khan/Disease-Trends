"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-aqua-600"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.06 }}
        className="font-display mt-1.5 text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight text-aqua-950"
      >
        {title}
      </motion.h2>
      {hint ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Chip({ children, tone = "aqua" }: { children: ReactNode; tone?: "aqua" | "slate" | "deep" }) {
  const cls =
    tone === "deep"
      ? "bg-aqua-950 text-aqua-100 border-aqua-800"
      : tone === "slate"
        ? "bg-slate-50 text-slate-600 border-slate-200"
        : "bg-aqua-50 text-aqua-800 border-aqua-100";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="font-display mt-1 text-xl font-bold text-aqua-950 sm:text-2xl">{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p> : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-aqua-100/60 ${className}`} />;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
