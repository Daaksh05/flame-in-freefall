import { fetchExperiments, fetchRanking, fetchRiskIndex, fetchSummary } from "@/lib/api";
import SummaryCards from "@/components/SummaryCards";
import ExperimentTable from "@/components/ExperimentTable";
import ChatPanel from "@/components/ChatPanel";
import RiskIndexChart from "@/components/RiskIndexChart";
import ExtinctionScatterChart from "@/components/ExtinctionScatterChart";

export const instant = false;

export default async function Home() {
  const [summary, experiments, ranking, riskIndex] = await Promise.all([
    fetchSummary(),
    fetchExperiments(),
    fetchRanking(5),
    fetchRiskIndex(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Flame in Freefall</h1>
        <p className="text-sm text-zinc-500">
          Microgravity combustion intelligence · fire-safety insights for human spaceflight
        </p>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <SummaryCards summary={summary} />
        <RiskIndexChart data={riskIndex} />
        <ExtinctionScatterChart experiments={experiments} />
        <ExperimentTable experiments={ranking} title="Hardest to extinguish (highest extinction velocity)" />
        <ExperimentTable experiments={experiments} title="All experiments" />
        <ChatPanel />
      </main>
    </div>
  );
}
