"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RiskIndexEntry } from "@/lib/api";

const LEVEL_COLOR: Record<string, string> = {
  critical: "var(--viz-critical)",
  serious: "var(--viz-serious)",
  warning: "var(--viz-warning)",
  good: "var(--viz-good)",
};

const LEVEL_LABEL: Record<string, string> = {
  critical: "Critical",
  serious: "Serious",
  warning: "Warning",
  good: "Good",
};

function Tick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const label = payload?.value ?? "";
  const short = label.length > 28 ? `${label.slice(0, 27)}…` : label;
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill="var(--viz-text-secondary)">
      {short}
    </text>
  );
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: RiskIndexEntry }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-zinc-200 bg-white p-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{d.material}</p>
      <p className="text-zinc-600 dark:text-zinc-300">Risk score: {d.risk_score}</p>
      {d.min_o2_pct !== null && <p className="text-zinc-600 dark:text-zinc-300">Lowest O2 sustaining flame: {d.min_o2_pct}%</p>}
      {d.max_extinction_velocity_cm_s !== null && (
        <p className="text-zinc-600 dark:text-zinc-300">Max extinction velocity: {d.max_extinction_velocity_cm_s} cm/s</p>
      )}
      <p className="text-zinc-500">{d.test_count} test(s) · {d.programs.join(", ")}</p>
    </div>
  );
}

export default function RiskIndexChart({ data }: { data: RiskIndexEntry[] }) {
  const scored = data.filter((d) => d.risk_score !== null).sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0));

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Fire Risk Index by material</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Composite score (0-100): lower flammability O2 limit + higher extinction velocity = harder to prevent and harder to put out
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {Object.entries(LEVEL_LABEL).map(([level, label]) => (
          <span key={level} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: LEVEL_COLOR[level] }} />
            {label}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(220, scored.length * 32)}>
        <BarChart data={scored} layout="vertical" margin={{ top: 8, right: 36, bottom: 8, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--viz-grid)" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--viz-text-muted)" }} stroke="var(--viz-axis)" />
          <YAxis type="category" dataKey="material" width={176} tick={<Tick />} stroke="var(--viz-axis)" />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--viz-grid)", opacity: 0.4 }} />
          <Bar dataKey="risk_score" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {scored.map((entry) => (
              <Cell key={entry.material} fill={LEVEL_COLOR[entry.risk_level] ?? "var(--viz-series-1)"} />
            ))}
            <LabelList dataKey="risk_score" position="right" fontSize={11} fill="var(--viz-text-secondary)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
