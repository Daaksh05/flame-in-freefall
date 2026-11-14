import {
  Experiment,
  ExperimentFilterParams,
  PaginatedExperimentsResponse,
} from "@/types";
import { fetchFromBackend } from "./apiClient";

/**
 * Fetch paginated microgravity combustion experiments with optional filters.
 * Corresponds to FastAPI: GET /api/v1/experiments
 */
export async function getExperiments(
  filters: ExperimentFilterParams = {}
): Promise<PaginatedExperimentsResponse> {
  const params: Record<string, string | number | boolean | undefined> = {
    material: filters.material,
    platform: filters.platform && filters.platform !== "ALL" ? filters.platform : undefined,
    min_oxygen: filters.min_oxygen,
    max_oxygen: filters.max_oxygen,
    min_flow: filters.min_flow,
    max_flow: filters.max_flow,
    q: filters.search_query,
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };

  return fetchFromBackend<PaginatedExperimentsResponse>("/api/v1/experiments", {
    method: "GET",
    params,
  });
}

/**
 * Fetch single experiment details by ID.
 * Corresponds to FastAPI: GET /api/v1/experiments/{id}
 */
export async function getExperimentById(id: string): Promise<Experiment> {
  return fetchFromBackend<Experiment>(`/api/v1/experiments/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

/**
 * Fetch catalog of tested materials for filter dropdowns.
 * Corresponds to FastAPI: GET /api/v1/experiments/materials
 */
export async function getMaterialsList(): Promise<string[]> {
  return fetchFromBackend<string[]>("/api/v1/experiments/materials", {
    method: "GET",
  });
}

/**
 * Fetch active microgravity platforms list.
 * Corresponds to FastAPI: GET /api/v1/experiments/platforms
 */
export async function getPlatformsList(): Promise<string[]> {
  return fetchFromBackend<string[]>("/api/v1/experiments/platforms", {
    method: "GET",
  });
}
