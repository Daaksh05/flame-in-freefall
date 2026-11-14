import {
  Experiment,
  ExperimentFilterParams,
  PaginatedExperimentsResponse,
} from "@/types";
import { fetchFromBackend } from "./apiClient";
import { BENCHMARK_EXPERIMENTS } from "@/data/nasaBenchmarkData";

/**
 * Fetch paginated microgravity combustion experiments with optional filters
 * Corresponds to FastAPI: GET /api/v1/experiments
 * Seamlessly falls back to NASA benchmark records if backend is offline.
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

  try {
    return await fetchFromBackend<PaginatedExperimentsResponse>("/api/v1/experiments", {
      method: "GET",
      params,
    });
  } catch (error) {
    // Graceful fallback to client-side NASA benchmark filter if backend is not started
    let filtered = [...BENCHMARK_EXPERIMENTS];

    if (filters.material) {
      filtered = filtered.filter((e) =>
        e.material.toLowerCase().includes(filters.material!.toLowerCase())
      );
    }
    if (filters.platform && filters.platform !== "ALL") {
      filtered = filtered.filter((e) => e.platform === filters.platform);
    }
    if (filters.min_oxygen !== undefined) {
      filtered = filtered.filter((e) => e.oxygen_concentration >= filters.min_oxygen!);
    }
    if (filters.max_oxygen !== undefined) {
      filtered = filtered.filter((e) => e.oxygen_concentration <= filters.max_oxygen!);
    }
    if (filters.search_query) {
      const q = filters.search_query.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.test_run.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      items: paginated,
      total: filtered.length,
      page,
      limit,
      total_pages: Math.ceil(filtered.length / limit) || 1,
    };
  }
}

/**
 * Fetch single experiment details by ID
 * Corresponds to FastAPI: GET /api/v1/experiments/{id}
 */
export async function getExperimentById(id: string): Promise<Experiment> {
  try {
    return await fetchFromBackend<Experiment>(`/api/v1/experiments/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  } catch {
    const found = BENCHMARK_EXPERIMENTS.find((e) => e.id === id);
    if (found) return found;
    throw new Error(`Experiment ${id} not found.`);
  }
}

/**
 * Fetch catalog of tested materials for filter dropdowns
 * Corresponds to FastAPI: GET /api/v1/experiments/materials
 */
export async function getMaterialsList(): Promise<string[]> {
  try {
    return await fetchFromBackend<string[]>("/api/v1/experiments/materials", {
      method: "GET",
    });
  } catch {
    const mats = Array.from(new Set(BENCHMARK_EXPERIMENTS.map((e) => e.material)));
    return mats;
  }
}

/**
 * Fetch active microgravity platforms list
 * Corresponds to FastAPI: GET /api/v1/experiments/platforms
 */
export async function getPlatformsList(): Promise<string[]> {
  try {
    return await fetchFromBackend<string[]>("/api/v1/experiments/platforms", {
      method: "GET",
    });
  } catch {
    return ["ISS_CIR", "ZERO_G_FACILITY", "DROP_TOWER_2_2S", "PARABOLIC_FLIGHT", "SOUNDING_ROCKET"];
  }
}
