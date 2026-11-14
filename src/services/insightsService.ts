import { FireSafetyInsight, SystemMetrics } from "@/types";
import { fetchFromBackend } from "./apiClient";
import {
  BENCHMARK_INSIGHTS,
  BENCHMARK_METRICS,
} from "@/data/nasaBenchmarkData";

/**
 * Fetch critical microgravity fire safety insights and threshold alerts
 * Corresponds to FastAPI: GET /api/v1/insights/fire-safety
 */
export async function getFireSafetyInsights(): Promise<FireSafetyInsight[]> {
  try {
    return await fetchFromBackend<FireSafetyInsight[]>("/api/v1/insights/fire-safety", {
      method: "GET",
    });
  } catch {
    return BENCHMARK_INSIGHTS;
  }
}

/**
 * Fetch aggregate telemetry & system metrics
 * Corresponds to FastAPI: GET /api/v1/metrics/summary
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    return await fetchFromBackend<SystemMetrics>("/api/v1/metrics/summary", {
      method: "GET",
    });
  } catch {
    return BENCHMARK_METRICS;
  }
}
