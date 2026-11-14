import { Experiment } from "@/lib/api";

function fmt(value: number | string | null | undefined) {
  return value === null || value === undefined || value === "" ? "—" : value;
}

const OUTCOME_STYLES: Record<string, string> = {
  quenched: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  blowoff: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  no_blowoff: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  no_ignition: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  steady_burn: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  flammability_limit: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  one_sided_flame: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export default function ExperimentTable({ experiments, title }: { experiments: Experiment[]; title: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="border-b border-zinc-200 px-4 py-3 font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Program</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">O2 %</th>
              <th className="px-4 py-2">Flow (cm/s)</th>
              <th className="px-4 py-2">Extinction v (cm/s)</th>
              <th className="px-4 py-2">Spread rate (mm/s)</th>
              <th className="px-4 py-2">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((exp) => (
              <tr key={exp.experiment_id} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-2 font-mono text-xs">{exp.experiment_id}</td>
                <td className="px-4 py-2">{exp.program}</td>
                <td className="px-4 py-2">{exp.material}</td>
                <td className="px-4 py-2">{fmt(exp.oxygen_pct)}</td>
                <td className="px-4 py-2">{fmt(exp.flow_velocity_cm_s)}</td>
                <td className="px-4 py-2">{fmt(exp.extinction_velocity_cm_s)}</td>
                <td className="px-4 py-2">{fmt(exp.flame_spread_rate_mm_s)}</td>
                <td className="px-4 py-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${OUTCOME_STYLES[exp.outcome] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                    {exp.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
