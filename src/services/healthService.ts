import { BackendHealthResponse } from "@/types";
import { fetchFromBackend } from "./apiClient";

/**
 * Check backend connection and status
 * Corresponds to FastAPI: GET /health or /api/v1/health
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  return fetchFromBackend<BackendHealthResponse>("/health", {
    method: "GET",
  });
}
