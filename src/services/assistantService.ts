import { ChatRequest, ChatResponse, Citation } from "@/types";
import { fetchFromBackend } from "./apiClient";

/**
 * Send a query to the NASA Microgravity RAG Assistant.
 * Corresponds to FastAPI: POST /api/v1/assistant/chat
 */
export async function queryAssistant(payload: ChatRequest): Promise<ChatResponse> {
  return fetchFromBackend<ChatResponse>("/api/v1/assistant/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch the catalog of NASA reports indexed for RAG (real sources only).
 * Corresponds to FastAPI: GET /api/v1/assistant/citations
 */
export async function getCitations(query?: string): Promise<Citation[]> {
  return fetchFromBackend<Citation[]>("/api/v1/assistant/citations", {
    method: "GET",
    params: { q: query },
  });
}
