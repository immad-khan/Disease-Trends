"use client";

import Image from "next/image";

export function Brand() {
  return (
    <a href="#" className="flex items-center gap-3">
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-aqua-100">
        <Image
          src="/brand/ogdcl-logo.png"
          alt="OGDCL"
          fill
          sizes="36px"
          className="object-contain p-1"
          priority
        />
      </div>
      <span className="leading-tight">
        <span className="font-display block text-[15px] font-extrabold tracking-tight text-aqua-950">
          OGDCL <span className="text-aqua-600">3D Atlas</span>
        </span>
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
          Disease Surveillance · 2015–2026
        </span>
      </span>
    </a>
  );
}
