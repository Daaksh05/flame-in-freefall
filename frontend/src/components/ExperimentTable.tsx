import { Experiment } from "@/lib/api";

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
              <th className="px-4 py-2">Gravity</th>
              <th className="px-4 py-2">Flame spread (mm/s)</th>
              <th className="px-4 py-2">Burn rate (mg/s)</th>
              <th className="px-4 py-2">Extinguished</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((exp) => (
              <tr key={exp.experiment_id} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-2 font-mono text-xs">{exp.experiment_id}</td>
                <td className="px-4 py-2">{exp.program}</td>
                <td className="px-4 py-2">{exp.material}</td>
                <td className="px-4 py-2">{exp.oxygen_pct}</td>
                <td className="px-4 py-2">{exp.gravity_level}</td>
                <td className="px-4 py-2">{exp.flame_spread_rate_mm_s}</td>
                <td className="px-4 py-2">{exp.burn_rate_mg_s}</td>
                <td className="px-4 py-2">{exp.extinguished ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
