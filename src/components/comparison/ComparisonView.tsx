"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitCompare,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Experiment } from "@/types";
import { compareExperiments, MultiExperimentComparison } from "@/services/comparisonService";
import { getExperiments } from "@/services/experimentService";
import { formatPlatform } from "@/lib/utils";

export function ComparisonView() {
  const [availableExperiments, setAvailableExperiments] = useState<Experiment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<MultiExperimentComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [enableThirdSlot, setEnableThirdSlot] = useState(false);

  // Load available experiments for the dropdown pickers
  useEffect(() => {
    getExperiments({ limit: 50 }).then((res) => {
      if (res.items && res.items.length >= 2) {
        setAvailableExperiments(res.items);
        setSelectedIds([res.items[0].id, res.items[1].id]);
      }
    });
  }, []);

  const runComparison = async (ids: string[]) => {
    if (ids.length < 2) return;
    setLoading(true);
    try {
      const res = await compareExperiments(ids);
      setComparison(res);
    } catch {
      // Benchmark fallback handles comparison
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length >= 2) {
      runComparison(selectedIds);
    }
  }, [selectedIds]);

  const handleSelectChange = (slotIndex: number, newId: string) => {
    setSelectedIds((prev) => {
      const updated = [...prev];
      updated[slotIndex] = newId;
      return updated;
    });
  };

  const handleToggleThirdSlot = () => {
    if (enableThirdSlot) {
      // remove 3rd slot
      setSelectedIds((prev) => prev.slice(0, 2));
      setEnableThirdSlot(false);
    } else {
      // add 3rd slot
      const third = availableExperiments[2]?.id || availableExperiments[0]?.id || "";
      setSelectedIds((prev) => [...prev.slice(0, 2), third]);
      setEnableThirdSlot(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-[#111726]/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
              Comparative Microgravity Physics
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-orange-400" />
            <span>Multi-Experiment Side-by-Side Comparison</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Evaluate 2 to 3 microgravity combustion runs side-by-side to analyze differential flame spread rates, oxygen extinction regimes, and convective flow vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleThirdSlot}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border transition-colors ${
              enableThirdSlot
                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
            }`}
          >
            {enableThirdSlot ? (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove 3rd Run</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add 3rd Experiment Slot</span>
              </>
            )}
          </button>

          <button
            onClick={() => runComparison(selectedIds)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs font-mono transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className={`grid grid-cols-1 ${enableThirdSlot ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
        {/* Slot 1: Experiment A */}
        <div className="p-4 rounded-2xl bg-[#111726]/80 border border-orange-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-semibold">
              Experiment 1 (Baseline Run)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20">
              SLOT A
            </span>
          </div>
          <select
            value={selectedIds[0] || ""}
            onChange={(e) => handleSelectChange(0, e.target.value)}
            className="w-full bg-[#0b101e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
          >
            {availableExperiments.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.test_run || exp.name} ({exp.material} • {exp.oxygen_concentration}%)
              </option>
            ))}
          </select>
        </div>

        {/* Slot 2: Experiment B */}
        <div className="p-4 rounded-2xl bg-[#111726]/80 border border-cyan-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
              Experiment 2 (Comparative Run)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              SLOT B
            </span>
          </div>
          <select
            value={selectedIds[1] || ""}
            onChange={(e) => handleSelectChange(1, e.target.value)}
            className="w-full bg-[#0b101e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            {availableExperiments.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.test_run || exp.name} ({exp.material} • {exp.oxygen_concentration}%)
              </option>
            ))}
          </select>
        </div>

        {/* Slot 3: Experiment C (Optional 3-run comparison) */}
        {enableThirdSlot && (
          <div className="p-4 rounded-2xl bg-[#111726]/80 border border-emerald-500/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                Experiment 3 (Triad Analysis)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                SLOT C
              </span>
            </div>
            <select
              value={selectedIds[2] || ""}
              onChange={(e) => handleSelectChange(2, e.target.value)}
              className="w-full bg-[#0b101e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              {availableExperiments.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.test_run || exp.name} ({exp.material} • {exp.oxygen_concentration}%)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {comparison && comparison.experiments.length >= 2 ? (
        <div className="space-y-6">
          {/* Header Summary Cards Side-by-Side */}
          <div className={`grid grid-cols-1 ${enableThirdSlot ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
            {comparison.experiments.map((exp, idx) => (
              <div
                key={exp.id}
                className={`p-5 rounded-2xl bg-[#111726]/90 border space-y-3 shadow-xl ${
                  idx === 0
                    ? "border-orange-500/40"
                    : idx === 1
                    ? "border-cyan-500/40"
                    : "border-emerald-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase ${
                      idx === 0
                        ? "text-orange-400"
                        : idx === 1
                        ? "text-cyan-400"
                        : "text-emerald-400"
                    }`}
                  >
                    RUN #{idx + 1} • {exp.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {formatPlatform(exp.platform)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono truncate">
                  {exp.name || exp.test_run}
                </h3>

                <div className="p-3 rounded-xl bg-[#0b101e] border border-slate-800/80 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Material:</span>
                    <span className="text-slate-200 truncate max-w-[150px] font-sans">
                      {exp.material}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">O₂ Concentration:</span>
                    <span className="text-orange-400 font-bold">
                      {exp.oxygen_concentration}% O₂
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flame Spread Rate:</span>
                    <span className="text-emerald-400 font-bold">
                      {exp.flame_spread_rate_mm_s ? `${exp.flame_spread_rate_mm_s} mm/s` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-Side Detailed Parameters Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#111726]/80 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-[#0b101e]/80 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Parameter Differential Matrix
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Comparing {comparison.experiments.length} Experimental Configurations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-[#0b101e]/40">
                    <th className="py-3.5 px-4 w-1/4">Physical Parameter</th>
                    {comparison.experiments.map((exp, idx) => (
                      <th
                        key={exp.id}
                        className={`py-3.5 px-4 ${
                          idx === 0
                            ? "text-orange-400"
                            : idx === 1
                            ? "text-cyan-400"
                            : "text-emerald-400"
                        }`}
                      >
                        Run #{idx + 1} ({exp.test_run})
                      </th>
                    ))}
                    <th className="py-3.5 px-4 w-1/3">Combustion Physics Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {comparison.metrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-semibold text-white">
                        {row.label}
                      </td>

                      {row.values.map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className={`py-3.5 px-4 font-bold ${
                            colIdx === 0
                              ? "text-orange-300"
                              : colIdx === 1
                              ? "text-cyan-300"
                              : "text-emerald-300"
                          }`}
                        >
                          {val !== null ? `${val} ${row.unit}` : "N/A"}
                        </td>
                      ))}

                      <td className="py-3.5 px-4 font-sans text-xs text-slate-400 leading-relaxed">
                        {row.riskSummary || "Standard measurement."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Synthesis Card */}
          {comparison.aiSynthesis && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/20 via-[#111726] to-cyan-950/20 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-orange-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Synthesis • Microgravity Combustion Regimes</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {comparison.aiSynthesis}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-[#111726]/40 text-center space-y-3">
          <GitCompare className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <h4 className="text-sm font-mono font-bold text-white">
            Select Experiments to Run Side-by-Side Analysis
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose 2 or 3 test runs from the dropdown selectors to calculate differentials in flame spread rate, flow velocity, and extinction limits.
          </p>
        </div>
      )}
    </div>
  );
}
