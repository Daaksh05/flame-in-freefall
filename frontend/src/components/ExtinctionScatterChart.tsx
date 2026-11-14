"use client";

import { CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { Experiment } from "@/lib/api";

const FAMILY_COLOR: Record<string, string> = {
  "Fabric (SIBAL)": "var(--viz-series-1)",
  "PMMA rod": "var(--viz-series-2)",
  "PMMA sheet": "var(--viz-series-3)",
};

function familyOf(material: string): string | null {
  if (material.startsWith("Cotton-fiberglass")) return "Fabric (SIBAL)";
  if (material.startsWith("PMMA rod")) return "PMMA rod";
  if (material.startsWith("PMMA sheet")) return "PMMA sheet";
  return null;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Experiment }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-zinc-200 bg-white p-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{d.experiment_id}</p>
      <p className="text-zinc-600 dark:text-zinc-300">{d.material}</p>
      <p className="text-zinc-600 dark:text-zinc-300">O2: {d.oxygen_pct}% · Extinction v: {d.extinction_velocity_cm_s} cm/s</p>
      <p className="text-zinc-500">Outcome: {d.outcome}</p>
    </div>
  );
}

export default function ExtinctionScatterChart({ experiments }: { experiments: Experiment[] }) {
  const points = experiments.filter((e) => e.extinction_velocity_cm_s !== null && e.oxygen_pct !== null && familyOf(e.material));
  const families = Array.from(new Set(points.map((p) => familyOf(p.material)!)));

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Extinction velocity vs oxygen concentration</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Each point is one test. Higher and further left = flammable at low O2 and hard to blow out.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--viz-grid)" />
          <XAxis
            type="number"
            dataKey="oxygen_pct"
            name="O2 %"
            unit="%"
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 11, fill: "var(--viz-text-muted)" }}
            stroke="var(--viz-axis)"
            label={{ value: "Oxygen %", position: "insideBottom", offset: -4, fontSize: 11, fill: "var(--viz-text-secondary)" }}
          />
          <YAxis
            type="number"
            dataKey="extinction_velocity_cm_s"
            name="Extinction velocity"
            unit=" cm/s"
            tick={{ fontSize: 11, fill: "var(--viz-text-muted)" }}
            stroke="var(--viz-axis)"
            label={{ value: "Extinction velocity (cm/s)", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--viz-text-secondary)" }}
          />
          <ZAxis range={[64, 64]} />
          <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {families.map((family) => (
            <Scatter
              key={family}
              name={family}
              data={points.filter((p) => familyOf(p.material) === family)}
              fill={FAMILY_COLOR[family]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
