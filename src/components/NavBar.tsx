"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map as MapIcon, Pill } from "lucide-react";

const LINKS = [
  { href: "/", label: "3D Atlas", icon: MapIcon },
  { href: "/medicine-orders", label: "Medicine Orders", icon: Pill },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-aqua-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-aqua-100">
            <Image src="/brand/ogdcl-logo.png" alt="OGDCL" fill sizes="36px" className="object-contain p-1" priority />
          </div>
          <span className="leading-tight">
            <span className="font-display block text-[15px] font-extrabold tracking-tight text-aqua-950">
              OGDCL <span className="text-aqua-600">3D Atlas</span>
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Disease Intelligence &amp; Care Suite
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-aqua-100 bg-aqua-50/50 p-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition sm:px-4 ${
                  active ? "text-white" : "text-aqua-700 hover:text-aqua-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-aqua-600 to-teal-500"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <l.icon className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10 hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
