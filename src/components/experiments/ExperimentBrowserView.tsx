"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Layers,
  Compass,
  Flame,
  RefreshCw,
  Eye,
  X,
  SlidersHorizontal,
  GitCompare,
  ChevronLeft,
  ChevronRight,
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
    setMinOxygen(0);
    setMaxOxygen(100);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {backendError && <BackendNotice message={backendError} />}

      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FFE4CC] px-2 py-0.5 text-[10px] font-semibold text-[#EA580C]">
              Experiment Browser
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#EA580C]" />
            <span>NASA BASS / BASS-II Experiment Browser</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Filter empirical combustion run logs from the ISS Microgravity Science Glovebox (MSG), with a 1g ground-comparison condition.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 border border-slate-200 transition-colors duration-200"
          >
            Reset Filters
          </button>
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium text-xs transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Search &amp; filter parameters</span>
          </div>
          <span className="text-xs font-medium text-[#EA580C] bg-[#FFF4EC] px-2.5 py-1 rounded-full border border-[#FED7AA]">
            {total} records found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500">Search test run / notes</label>
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
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#FED7AA] transition-colors duration-200"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Material Name Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500">Combustion material</label>
            <select
              value={selectedMaterial}
              onChange={(e) => {
                setSelectedMaterial(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#FED7AA] transition-colors duration-200"
            >
              <option value="">All materials</option>
              {materialsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Platform / Gravity Level Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500">Platform / gravity facility</label>
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#FED7AA] transition-colors duration-200"
            >
              <option value="ALL">All platforms</option>
              {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label} ({info.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Oxygen Range Slider Controls */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">O₂ concentration range</span>
              <span className="text-[#EA580C] font-semibold">
                {minOxygen}% – {maxOxygen}% O₂
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1.5">
              <input
                type="range"
                min="0"
                max="100"
                value={minOxygen}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= maxOxygen) setMinOxygen(val);
                }}
                className="w-full accent-[#EA580C] cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={maxOxygen}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= minOxygen) setMaxOxygen(val);
                }}
                className="w-full accent-[#EA580C] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Experiments Data Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-[0.06em]">
                <th className="py-3.5 px-4">Test run / ID</th>
                <th className="py-3.5 px-4">Substrate / material</th>
                <th className="py-3.5 px-4">Platform facility</th>
                <th className="py-3.5 px-4">Oxygen %</th>
                <th className="py-3.5 px-4">Flow velocity</th>
                <th className="py-3.5 px-4">Pressure</th>
                <th className="py-3.5 px-4">Flame spread</th>
                <th className="py-3.5 px-4">Extinction regime</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-36" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : experiments.length > 0 ? (
                experiments.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => setSelectedExperiment(exp)}
                    className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>{exp.test_run || exp.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{exp.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 block truncate max-w-[180px]">
                        {exp.material}
                      </span>
                      <span className="text-[10px] text-slate-400">{exp.material_category}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                        {formatPlatform(exp.platform)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatOxygen(exp.oxygen_concentration)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatFlow(exp.flow_velocity_cm_s)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatPressure(exp.ambient_pressure_kpa)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#EA580C]">
                      {formatRate(exp.flame_spread_rate_mm_s)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          exp.extinction_mode === "Ongoing Combustion"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {exp.extinction_mode || "Ongoing"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedExperiment(exp)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition-colors duration-200"
                          title="Inspect details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/comparison?expA=${encodeURIComponent(exp.id)}`}
                          className="p-1.5 rounded-lg bg-[#FFF4EC] hover:bg-[#FFE8D1] text-[#EA580C] border border-[#FED7AA] transition-colors duration-200"
                          title="Send to comparison tool"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-500 space-y-2">
                    <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium text-slate-700">
                      No matching NASA combustion test runs found
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try broadening your search query or adjusting the oxygen concentration sliders.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          <div>
            Showing <span className="text-slate-700 font-semibold">{experiments.length}</span> of{" "}
            <span className="text-slate-700 font-semibold">{total}</span> total test runs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-500 border border-slate-200 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-500 border border-slate-200 transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Experiment Modal */}
      {selectedExperiment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative">
            <button
              onClick={() => setSelectedExperiment(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#EA580C] bg-[#FFF4EC] px-2 py-0.5 rounded-full border border-[#FED7AA] font-semibold">
                  {formatPlatform(selectedExperiment.platform)}
                </span>
                <span className="text-[11px] text-slate-400">
                  Run ID: {selectedExperiment.id}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedExperiment.name || selectedExperiment.test_run}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Combustion material</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                  {selectedExperiment.material}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Oxygen conc.</span>
                <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                  {formatOxygen(selectedExperiment.oxygen_concentration)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Flow velocity</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {formatFlow(selectedExperiment.flow_velocity_cm_s)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Chamber pressure</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {formatPressure(selectedExperiment.ambient_pressure_kpa)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Flame spread</span>
                <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                  {formatRate(selectedExperiment.flame_spread_rate_mm_s)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase">Burn duration</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {selectedExperiment.burn_duration_s ? `${selectedExperiment.burn_duration_s} s` : "N/A"}
                </p>
              </div>
            </div>

            {selectedExperiment.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                <span className="text-[10px] text-[#EA580C] uppercase tracking-wider block mb-1 font-semibold">
                  NASA test log &amp; observations
                </span>
                {selectedExperiment.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Link
                href={`/comparison?expA=${encodeURIComponent(selectedExperiment.id)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF4EC] hover:bg-[#FFE8D1] text-[#EA580C] border border-[#FED7AA] text-xs font-medium transition-colors duration-200"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare in side-by-side view</span>
              </Link>

              <button
                onClick={() => setSelectedExperiment(null)}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium transition-colors duration-200"
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
