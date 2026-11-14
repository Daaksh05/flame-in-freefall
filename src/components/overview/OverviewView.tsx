"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Flame,
  Activity,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Gauge,
} from "lucide-react";
import { FireSafetyInsight, SystemMetrics } from "@/types";
import {
  getFireSafetyInsights,
  getSystemMetrics,
  getRiskRanking,
  RiskRankingEntry,
} from "@/services/insightsService";
import { getSeverityColor } from "@/lib/utils";
import { BackendNotice } from "@/components/common/BackendNotice";

export function OverviewView() {
  const [insights, setInsights] = useState<FireSafetyInsight[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [rankedMaterials, setRankedMaterials] = useState<RiskRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [activeMaterialInsight, setActiveMaterialInsight] = useState<RiskRankingEntry | null>(null);

  const loadData = async () => {
    setLoading(true);
    setLoadError(undefined);
    try {
      const [insightsData, metricsData, rankingData] = await Promise.all([
        getFireSafetyInsights(),
        getSystemMetrics(),
        getRiskRanking(),
      ]);
      setInsights(insightsData);
      setMetrics(metricsData);
      setRankedMaterials(rankingData);
      setActiveMaterialInsight(rankingData[0] ?? null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInsights =
    selectedSeverity === "ALL"
      ? insights
      : insights.filter((i) => i.severity === selectedSeverity);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm md:p-8">
        <div className="absolute inset-y-0 right-0 w-80 bg-[radial-gradient(circle,_rgba(31,111,104,0.12),transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfeeea] bg-[#edf7f5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1f6f68]">
              <Flame className="h-3.5 w-3.5" />
              <span>Microgravity fire intelligence</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-[-0.05em] text-slate-900 md:text-4xl">
                Fire safety intelligence for freefall environments
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-[15px]">
                Monitoring the subtle combustion physics of freefall. In microgravity, weak ventilation and reduced buoyancy can sustain dangerous flame corridors while suppressing normal cooling, making low-flow ignition and extinction behaviour more critical than on Earth.
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Mission overview</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-medium text-emerald-700">
                Stable
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Lowest O₂ limit</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.05em] text-slate-900">
                  {rankedMaterials[0]?.loi !== null && rankedMaterials[0]?.loi !== undefined
                    ? `${rankedMaterials[0].loi}%`
                    : "—"}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">O₂ threshold (lowest observed)</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Hot spot</p>
                <p className="mt-2 truncate text-lg font-semibold tracking-[-0.05em] text-slate-900">
                  {rankedMaterials[0]?.material ?? "—"}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">Highest composite risk score</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#dfeeea] bg-[#edf7f5] px-3 py-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Dataset</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {metrics ? `${metrics.total_experiments} real NASA test conditions` : "Loading…"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#1f6f68]" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh telemetry</span>
            </button>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#1f6f68]" />
              <span>Ask AI assistant</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Experiments tracked",
            value: metrics?.total_experiments ?? "—",
            detail: "BASS, BASS-II, FLEX, Confined Combustion",
            accent: "text-[#1f6f68]",
            icon: Activity,
            bar: "w-4/5 bg-[#1f6f68]",
            iconBg: "bg-[#e1f1ee] text-[#1f6f68]",
            trend: null,
          },
          {
            label: "Avg flame spread rate",
            value:
              metrics?.average_flame_spread_rate != null
                ? `${metrics.average_flame_spread_rate} mm/s`
                : "N/A (not reported)",
            detail: "Across experiments with a measured spread rate",
            accent: "text-[#b7631d]",
            icon: Flame,
            bar: "w-3/5 bg-[#b7631d]",
            iconBg: "bg-[#f4e5d5] text-[#b7631d]",
            trend: null,
          },
          {
            label: "Critical-risk materials",
            value: metrics?.critical_safety_alerts ?? "—",
            detail: "Materials scoring ≥75/100 on the risk index",
            accent: "text-[#9b2c2c]",
            icon: ShieldAlert,
            bar: "w-2/3 bg-[#9b2c2c]",
            iconBg: "bg-[#fbe7e7] text-[#9b2c2c]",
            trend: "materials",
          },
          {
            label: "Materials cataloged",
            value: metrics?.materials_cataloged ?? "—",
            detail: "Distinct material variants in the dataset",
            accent: "text-[#1f6f68]",
            icon: Gauge,
            bar: "w-1/2 bg-[#1f6f68]",
            iconBg: "bg-[#e1f1ee] text-[#1f6f68]",
            trend: null,
          },
        ].map(({ label, value, detail, accent, icon: Icon, bar, iconBg, trend }) => (
          <div key={label} className="rounded-[22px] border border-slate-200 bg-white/80 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                {label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-3xl font-semibold tracking-[-0.05em] ${accent}`}>{value}</span>
              {trend && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {trend}
                </span>
              )}
            </div>

            <p className="mt-2 text-[11px] text-slate-500">{detail}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${bar}`} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              <Flame className="h-4 w-4 text-[#b7631d]" />
              Ranked fire-safety vulnerability
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Materials ranked by rapid spread and low-flow flammability in microgravity.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            NASA BASS / BASS-II / Confined Combustion
          </span>
        </div>

        {loadError && <BackendNotice endpoint="/api/v1/insights/risk-ranking" error={loadError} onRetry={loadData} />}

        {!loadError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/80 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Rank & substrate</span>
              <div className="flex items-center gap-6">
                <span>Extinction v</span>
                <span>Min O₂</span>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {rankedMaterials.map((item) => {
                const isSelected = activeMaterialInsight?.rank === item.rank;
                return (
                  <button
                    key={item.rank}
                    type="button"
                    onClick={() => setActiveMaterialInsight(item)}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors ${
                      isSelected ? "bg-[#edf7f5]" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-semibold ${
                          item.rank === 1
                            ? "bg-[#fbe7e7] text-[#9b2c2c]"
                            : item.rank === 2
                              ? "bg-[#f4e5d5] text-[#b7631d]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{item.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900">{item.material}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
                      <span className="text-[#b7631d]">
                        {item.extinctionVelocity !== null ? `${item.extinctionVelocity} cm/s` : "N/A"}
                      </span>
                      <span className="text-[#1f6f68]">{item.loi !== null ? `${item.loi}% O₂` : "N/A"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeMaterialInsight && (
            <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)] lg:col-span-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#fbe7e7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b2c2c]">
                  {activeMaterialInsight.riskLevel} risk
                </span>
                <span className="text-[11px] text-slate-500">Rank #{activeMaterialInsight.rank} of {rankedMaterials.length}</span>
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                {activeMaterialInsight.material}
              </h3>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Microgravity vulnerability
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeMaterialInsight.keyVulnerability}
                </p>
                <p className="mt-2 text-[10px] text-slate-400">
                  Based on {activeMaterialInsight.testCount} test condition(s) from {activeMaterialInsight.programs.join(", ")}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Extinction velocity</div>
                  <div className="mt-1 text-lg font-semibold text-[#b7631d]">
                    {activeMaterialInsight.extinctionVelocity !== null ? `${activeMaterialInsight.extinctionVelocity} cm/s` : "N/A"}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Lowest sustaining O₂</div>
                  <div className="mt-1 text-lg font-semibold text-[#1f6f68]">
                    {activeMaterialInsight.loi !== null ? `${activeMaterialInsight.loi}% O₂` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                <Link
                  href={`/experiments?material=${encodeURIComponent(activeMaterialInsight.material.split(" ")[0])}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <span>Browse test runs</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/assistant" className="inline-flex items-center gap-2 text-sm font-medium text-[#1f6f68]">
                  <Sparkles className="h-4 w-4" />
                  <span>RAG analysis</span>
                </Link>
              </div>
            </div>
          )}
        </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              <ShieldAlert className="h-4 w-4 text-[#1f6f68]" />
              Operational bulletins
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Generated from the composite risk index computed over real NASA experiment data.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-[11px] font-medium">
            {['ALL', 'CRITICAL', 'HIGH', 'ELEVATED'].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  selectedSeverity === sev ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredInsights.map((insight) => {
            const colors = getSeverityColor(insight.severity);
            return (
              <article key={insight.id} className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${colors.text}`}>
                        {insight.severity} • {insight.category}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-slate-900">
                      {insight.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600">
                    LOI: {insight.limiting_oxygen_index}% O₂
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{insight.summary}</p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1f6f68]">
                    Recommended protocol
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{insight.recommended_protocol}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
                  <span>Affected: {insight.relevant_materials.join(", ")}</span>
                  <span>{insight.id}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
