"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Layers,
  Compass,
  Flame,
  ArrowUpDown,
  RefreshCw,
  Eye,
  X,
  Gauge,
  Wind,
  SlidersHorizontal,
  GitCompare,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  Experiment,
  ExperimentFilterParams,
  MicrogravityPlatform,
} from "@/types";
import {
  getExperiments,
  getMaterialsList,
  getPlatformsList,
} from "@/services/experimentService";
import {
  formatPlatform,
  formatRate,
  formatOxygen,
  formatPressure,
  formatFlow,
} from "@/lib/utils";
import { PLATFORM_INFO } from "@/lib/constants";
import { BackendNotice } from "@/components/common/BackendNotice";

export function ExperimentBrowserView() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("ALL");
  const [minOxygen, setMinOxygen] = useState(0);
  const [maxOxygen, setMaxOxygen] = useState(100);
  const [sortBy, setSortBy] = useState<"date" | "flame_spread_rate" | "oxygen" | "name">("flame_spread_rate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Details Modal
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [materialsList, setMaterialsList] = useState<string[]>([]);

  const fetchRecords = async () => {
    setLoading(true);
    setBackendError(null);
    try {
      const filters: ExperimentFilterParams = {
        material: selectedMaterial || undefined,
        platform: selectedPlatform !== "ALL" ? (selectedPlatform as MicrogravityPlatform) : undefined,
        min_oxygen: minOxygen,
        max_oxygen: maxOxygen,
        search_query: searchQuery.trim() || undefined,
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await getExperiments(filters);
      setExperiments(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      setBackendError(err instanceof Error ? err.message : "Error querying experiments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaterialsList().then((list) => {
      if (list && list.length > 0) setMaterialsList(list);
    });
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [page, selectedMaterial, selectedPlatform, minOxygen, maxOxygen, sortBy, sortOrder]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedMaterial("");
    setSelectedPlatform("ALL");
    setMinOxygen(15);
    setMaxOxygen(40);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#111726]/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-[10px] font-mono uppercase text-orange-400 tracking-wider font-semibold">
              NASA Microgravity Science Data
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>NASA BASS / BASS-II Experiment Browser</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Filter empirical combustion run logs from the ISS Microgravity Science Glovebox (MSG), with a 1g ground-comparison condition.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs font-mono transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search & Chamber Filter Parameters</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
            {total} NASA Records Found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Search Test Run / Notes</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. BASS-II, FLEX, PMMA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(1);
                    fetchRecords();
                  }
                }}
                className="w-full bg-[#0b101e] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Material Name Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Combustion Material</label>
            <select
              value={selectedMaterial}
              onChange={(e) => {
                setSelectedMaterial(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0b101e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60 font-mono"
            >
              <option value="">All NASA Materials</option>
              {materialsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Platform / Gravity Level Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Platform / Gravity Facility</label>
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0b101e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60 font-mono"
            >
              <option value="ALL">All Platforms</option>
              {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label} ({info.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Oxygen Range Slider Controls */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">O₂ Concentration Range</span>
              <span className="text-orange-400 font-bold">
                {minOxygen}% – {maxOxygen}% O₂
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="range"
                min="12"
                max="35"
                value={minOxygen}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= maxOxygen) setMinOxygen(val);
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <input
                type="range"
                min="20"
                max="50"
                value={maxOxygen}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= minOxygen) setMaxOxygen(val);
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Experiments Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726]/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b101e]/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Test Run / ID</th>
                <th className="py-3.5 px-4">Substrate / Material</th>
                <th className="py-3.5 px-4">Platform Facility</th>
                <th className="py-3.5 px-4">Oxygen %</th>
                <th className="py-3.5 px-4">Flow Velocity</th>
                <th className="py-3.5 px-4">Pressure</th>
                <th className="py-3.5 px-4">Flame Spread</th>
                <th className="py-3.5 px-4">Extinction Regime</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-36" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-800 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : experiments.length > 0 ? (
                experiments.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => setSelectedExperiment(exp)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-orange-300 transition-colors">
                          {exp.test_run || exp.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {exp.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block truncate max-w-[180px]">
                        {exp.material}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {exp.material_category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[11px] font-mono text-cyan-300 border border-slate-700/80">
                        {formatPlatform(exp.platform)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      {formatOxygen(exp.oxygen_concentration)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-300">
                      {formatFlow(exp.flow_velocity_cm_s)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {formatPressure(exp.ambient_pressure_kpa)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {formatRate(exp.flame_spread_rate_mm_s)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          exp.extinction_mode === "Ongoing Combustion"
                            ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                            : "bg-slate-900 text-slate-300 border border-slate-800"
                        }`}
                      >
                        {exp.extinction_mode || "Ongoing"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedExperiment(exp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Inspect Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/comparison?expA=${encodeURIComponent(exp.id)}`}
                          className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-colors"
                          title="Send to Comparison Tool"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 space-y-2">
                    <Compass className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                    <p className="text-sm font-medium text-slate-200">
                      No matching NASA combustion test runs found
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try broadening your search query or adjusting the oxygen concentration sliders.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-[#0b101e]/60 text-xs font-mono text-slate-400">
          <div>
            Showing <span className="text-slate-200 font-bold">{experiments.length}</span> of{" "}
            <span className="text-slate-200 font-bold">{total}</span> total test runs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Experiment Modal */}
      {selectedExperiment && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedExperiment(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 font-semibold uppercase">
                  {formatPlatform(selectedExperiment.platform)}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Run ID: {selectedExperiment.id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                {selectedExperiment.name || selectedExperiment.test_run}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Combustion Material</span>
                <p className="text-xs font-bold text-white mt-0.5 truncate">
                  {selectedExperiment.material}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Oxygen Conc</span>
                <p className="text-xs font-bold text-orange-400 mt-0.5">
                  {formatOxygen(selectedExperiment.oxygen_concentration)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Flow Velocity</span>
                <p className="text-xs font-bold text-cyan-400 mt-0.5">
                  {formatFlow(selectedExperiment.flow_velocity_cm_s)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Chamber Pressure</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">
                  {formatPressure(selectedExperiment.ambient_pressure_kpa)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Flame Spread</span>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">
                  {formatRate(selectedExperiment.flame_spread_rate_mm_s)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Burn Duration</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">
                  {selectedExperiment.burn_duration_s ? `${selectedExperiment.burn_duration_s} s` : "N/A"}
                </p>
              </div>
            </div>

            {selectedExperiment.notes && (
              <div className="p-4 rounded-xl bg-[#0b101e] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  NASA Test Log & Observations:
                </span>
                {selectedExperiment.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <Link
                href={`/comparison?expA=${encodeURIComponent(selectedExperiment.id)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono font-medium transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare in Side-by-Side View</span>
              </Link>

              <button
                onClick={() => setSelectedExperiment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
