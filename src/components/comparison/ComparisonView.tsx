"use client";

import React, { useState, useEffect } from "react";
import {
  GitCompare,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { Experiment } from "@/types";
import { compareExperiments, MultiExperimentComparison } from "@/services/comparisonService";
import { getExperiments } from "@/services/experimentService";
import { formatPlatform } from "@/lib/utils";

const SLOT_STYLES = [
  { label: "A", accent: "text-[#EA580C]", border: "border-[#FED7AA]", chip: "bg-[#FFF4EC] text-[#EA580C] border-[#FED7AA]", ring: "focus:border-[#EA580C] focus:ring-[#FED7AA]" },
  { label: "B", accent: "text-[#b7631d]", border: "border-[#f0d9bc]", chip: "bg-[#f4e5d5] text-[#b7631d] border-[#f0d9bc]", ring: "focus:border-[#b7631d] focus:ring-[#f4e5d5]" },
  { label: "C", accent: "text-slate-600", border: "border-slate-200", chip: "bg-slate-50 text-slate-600 border-slate-200", ring: "focus:border-slate-400 focus:ring-slate-100" },
];

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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FFE4CC] px-2 py-0.5 text-[10px] font-semibold text-[#EA580C]">
              Side-by-side comparison
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#EA580C]" />
            <span>Multi-experiment side-by-side comparison</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Evaluate 2 to 3 microgravity combustion runs side-by-side to analyze differential flame spread rates, oxygen extinction regimes, and convective flow vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleThirdSlot}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors duration-200 ${
              enableThirdSlot
                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                : "bg-[#FFF4EC] hover:bg-[#FFE8D1] text-[#EA580C] border-[#FED7AA]"
            }`}
          >
            {enableThirdSlot ? (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove 3rd run</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add 3rd experiment slot</span>
              </>
            )}
          </button>

          <button
            onClick={() => runComparison(selectedIds)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium text-xs transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className={`grid grid-cols-1 ${enableThirdSlot ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5`}>
        {[0, 1, ...(enableThirdSlot ? [2] : [])].map((slotIdx) => {
          const style = SLOT_STYLES[slotIdx];
          return (
            <div key={slotIdx} className={`p-5 rounded-2xl bg-white border ${style.border} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-semibold ${style.accent}`}>
                  Experiment {slotIdx + 1} {slotIdx === 0 ? "(baseline run)" : slotIdx === 1 ? "(comparative run)" : "(triad analysis)"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${style.chip}`}>
                  Slot {style.label}
                </span>
              </div>
              <select
                value={selectedIds[slotIdx] || ""}
                onChange={(e) => handleSelectChange(slotIdx, e.target.value)}
                className={`w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 transition-colors duration-200 ${style.ring}`}
              >
                {availableExperiments.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.test_run || exp.name} ({exp.material} • {exp.oxygen_concentration}%)
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Comparison Grid */}
      {comparison && comparison.experiments.length >= 2 ? (
        <div className="space-y-6">
          {/* Header Summary Cards Side-by-Side */}
          <div className={`grid grid-cols-1 ${enableThirdSlot ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5`}>
            {comparison.experiments.map((exp, idx) => {
              const style = SLOT_STYLES[idx];
              return (
                <div key={exp.id} className={`p-5 rounded-2xl bg-white border ${style.border} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${style.accent}`}>
                      Run #{idx + 1} • {exp.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500">
                      {formatPlatform(exp.platform)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {exp.name || exp.test_run}
                  </h3>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Material:</span>
                      <span className="text-slate-700 truncate max-w-[150px]">{exp.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">O₂ concentration:</span>
                      <span className={`font-semibold ${style.accent}`}>
                        {exp.oxygen_concentration}% O₂
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Flame spread rate:</span>
                      <span className="text-slate-700 font-semibold">
                        {exp.flame_spread_rate_mm_s ? `${exp.flame_spread_rate_mm_s} mm/s` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Detailed Parameters Table */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Parameter differential matrix
              </span>
              <span className="text-[11px] text-slate-400">
                Comparing {comparison.experiments.length} experimental configurations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-[0.06em] bg-slate-50">
                    <th className="py-3.5 px-4 w-1/4">Physical parameter</th>
                    {comparison.experiments.map((exp, idx) => (
                      <th key={exp.id} className={`py-3.5 px-4 ${SLOT_STYLES[idx].accent}`}>
                        Run #{idx + 1} ({exp.test_run})
                      </th>
                    ))}
                    <th className="py-3.5 px-4 w-1/3">Combustion physics note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparison.metrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="py-3.5 px-4 font-medium text-slate-800">{row.label}</td>

                      {row.values.map((val, colIdx) => (
                        <td key={colIdx} className={`py-3.5 px-4 font-semibold ${SLOT_STYLES[colIdx].accent}`}>
                          {val !== null ? `${val} ${row.unit}` : "N/A"}
                        </td>
                      ))}

                      <td className="py-3.5 px-4 text-xs text-slate-500 leading-relaxed">
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
            <div className="p-6 rounded-2xl bg-[#FFF4EC] border border-[#FED7AA] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#EA580C]">
                <Sparkles className="w-4 h-4" />
                <span>AI synthesis • microgravity combustion regimes</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {comparison.aiSynthesis}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-3">
          <GitCompare className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-700">
            Select experiments to run side-by-side analysis
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose 2 or 3 test runs from the dropdown selectors to calculate differentials in flame spread rate, flow velocity, and extinction limits.
          </p>
        </div>
      )}
    </div>
  );
}
