import { FireSafetyInsight, SystemMetrics } from "@/types";
import { fetchFromBackend } from "./apiClient";

/**
 * Fetch fire-safety insights derived from the real per-material risk index.
 * Corresponds to FastAPI: GET /api/v1/insights/fire-safety
 */
export async function getFireSafetyInsights(): Promise<FireSafetyInsight[]> {
  return fetchFromBackend<FireSafetyInsight[]>("/api/v1/insights/fire-safety", {
    method: "GET",
  });
}

/**
 * Fetch aggregate dataset metrics.
 * Corresponds to FastAPI: GET /api/v1/metrics/summary
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  return fetchFromBackend<SystemMetrics>("/api/v1/metrics/summary", {
    method: "GET",
  });
}

export interface RiskRankingEntry {
  rank: number;
  material: string;
  category: string;
  flameSpreadRate: number | null;
  extinctionVelocity: number | null;
  loi: number | null;
  riskLevel: "CRITICAL" | "HIGH" | "ELEVATED" | "NOMINAL";
  keyVulnerability: string;
  testCount: number;
  programs: string[];
}

/**
 * Fetch the real per-material risk ranking (composite Fire Risk Index).
 * Corresponds to FastAPI: GET /api/v1/insights/risk-ranking
 */
export async function getRiskRanking(): Promise<RiskRankingEntry[]> {
  return fetchFromBackend<RiskRankingEntry[]>("/api/v1/insights/risk-ranking", {
    method: "GET",
  });
}
