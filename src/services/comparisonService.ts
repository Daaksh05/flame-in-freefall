import { fetchFromBackend } from "./apiClient";
import { Experiment } from "@/types";

export interface MultiExperimentComparison {
  experiments: Experiment[];
  metrics: {
    metric: string;
    label: string;
    unit: string;
    values: (number | string | null)[];
    riskSummary?: string;
  }[];
  aiSynthesis?: string;
}

/**
 * Compare 2 or more microgravity combustion experiments side-by-side.
 * Corresponds to FastAPI: GET /api/v1/experiments/compare?exp_ids=id1,id2,id3
 */
export async function compareExperiments(
  experimentIds: string[]
): Promise<MultiExperimentComparison> {
  const idsParam = experimentIds.join(",");

  return fetchFromBackend<MultiExperimentComparison>("/api/v1/experiments/compare", {
    method: "GET",
    params: { exp_ids: idsParam },
  });
}
