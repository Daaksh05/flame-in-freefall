"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Radio, Clock, Terminal, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

const viewTitles: Record<string, { title: string; subtitle: string; code: string }> = {
  "/": {
    title: "Mission Overview & Fire-Safety Insights",
    subtitle: "Real-time microgravity flame thresholds, flammability ranking & LOI envelopes",
    code: "VIEW-01 • INSIGHTS",
  },
  "/overview": {
    title: "Mission Overview & Fire-Safety Insights",
    subtitle: "Real-time microgravity flame thresholds, flammability ranking & LOI envelopes",
    code: "VIEW-01 • INSIGHTS",
  },
  "/experiments": {
    title: "NASA FLEX & BASS Experiment Browser",
    subtitle: "Filter empirical test run logs by material, oxygen concentration, and platform",
    code: "VIEW-02 • BROWSER",
  },
  "/comparison": {
    title: "Side-by-Side Comparison Tool",
    subtitle: "Multi-run differential analysis of flame spread rates, flow velocities, and quenching",
    code: "VIEW-03 • COMPARISON",
  },
  "/assistant": {
    title: "AI Combustion Research Assistant",
    subtitle: "RAG engine grounded in NASA Technical Reports Server (NTRS) literature",
    code: "VIEW-04 • RAG CHAT",
  },
};

export function Header() {
  const pathname = usePathname();
  const current = viewTitles[pathname] || {
    title: "NASA Microgravity Combustion Dashboard",
    subtitle: "Flame in Freefall Research Suite",
    code: "MISSION CONTROL",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f6f68]">
              {current.code}
            </span>
          </div>
          <h1 className="text-sm font-semibold tracking-[-0.02em] text-slate-900 md:text-base">
            {current.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 md:flex">
          <Radio className="h-3.5 w-3.5" />
          <span className="font-medium">ISS CIR Telemetry: Nominal</span>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 lg:flex">
          <Clock className="h-3.5 w-3.5 text-[#b7631d]" />
          <span>MET: 214:18:04</span>
        </div>

        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          title="Open FastAPI Swagger Documentation"
        >
          <Terminal className="h-3.5 w-3.5 text-[#1f6f68]" />
          <span>FastAPI Docs</span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>
    </header>
  );
}
