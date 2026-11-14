import { Summary } from "@/lib/api";

export default function SummaryCards({ summary }: { summary: Summary }) {
  const cards = [
    { label: "Total experiments", value: summary.total_experiments },
    { label: "Programs", value: summary.programs.join(", ") },
    { label: "Avg extinction velocity", value: `${summary.avg_extinction_velocity_cm_s} cm/s` },
    { label: "Extinguished rate", value: `${summary.extinguished_rate_pct}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
