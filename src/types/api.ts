/**
 * NASA Microgravity Combustion Data & API Type Definitions
 * "Flame in Freefall" Dashboard
 */

// Real platforms present in our extracted dataset. "ISS-MSG" is the Microgravity
// Science Glovebox (where BASS-II/BASS/Confined Combustion ran); "Ground" is a 1g
// comparison condition used in a handful of rows. Kept as `string` rather than a
// narrow union since the dataset is still growing and we don't want to silently
// drop real platform values that don't match an invented enum.
export type MicrogravityPlatform = string;

export type MaterialCategory = string;

export type FlameExtinctionMode = string;

export interface Experiment {
  id: string;
  name: string;
  test_run: string;
  material: string;
  material_category: MaterialCategory;
  platform: MicrogravityPlatform;
  oxygen_concentration: number | null;  // percentage, e.g. 21.0 for 21%
  ambient_pressure_kpa: number | null;  // kPa
  flow_velocity_cm_s: number | null;    // cm/s (forced ventilation flow)
  extinction_velocity_cm_s: number | null; // cm/s (flow needed to blow the flame out)
  flame_spread_rate_mm_s: number | null; // mm/s
  peak_temperature_c: number | null; // Celsius — not available in current dataset
  burn_duration_s: number | null;    // seconds — not available in current dataset
  quenching_distance_mm: number | null; // not available in current dataset
  extinction_mode: FlameExtinctionMode;
  date_conducted: string | null;     // not available for these reports
  chamber_atmosphere: string | null; // derived from oxygen_concentration
  program?: string;
  source_report?: string;
  video_url?: string;
  sensor_telemetry_url?: string;
  notes?: string | null;
}

export interface ExperimentFilterParams {
  material?: string;
  platform?: string;
  min_oxygen?: number;
  max_oxygen?: number;
  min_flow?: number;
  max_flow?: number;
  search_query?: string;
  page?: number;
  limit?: number;
  sort_by?: "date" | "flame_spread_rate" | "oxygen" | "name";
  sort_order?: "asc" | "desc";
}

export interface PaginatedExperimentsResponse {
  items: Experiment[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface FireSafetyInsight {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "NOMINAL";
  category: "Flammability Limit" | "Extinction Hazard" | "Ventilation Risk" | "Material Safety";
  summary: string;
  detailed_analysis: string;
  recommended_protocol: string;
  relevant_materials: string[];
  limiting_oxygen_index: number;
  affected_platforms: string[];
  citation_ids: string[];
  created_at: string;
}

export interface SystemMetrics {
  total_experiments: number;
  active_platforms_count: number;
  materials_cataloged: number;
  critical_safety_alerts: number;
  last_telemetry_sync: string;
  average_flame_spread_rate: number | null;
}

export interface ComparisonDiff {
  metric: string;
  label: string;
  value_a: number | string | null;
  value_b: number | string | null;
  diff_percentage?: number | null;
  higher_risk_side?: "A" | "B" | "EQUAL" | "N/A";
  unit: string;
  explanation: string;
}

export interface ExperimentComparisonResponse {
  experiment_a: Experiment;
  experiment_b: Experiment;
  metrics_comparison: ComparisonDiff[];
  ai_synthesis?: string;
}

export interface Citation {
  id: string;
  title: string;
  authors: string[]; // not parsed out of source reports yet — may be empty
  year: number | null;
  publication: string;
  doi_or_ntrs_id?: string | null;
  source_url?: string;
  snippet: string; // not populated by the current RAG pipeline
  relevance_score: number | null;
}

export interface ChatMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Citation[];
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context_filters?: {
    material?: string;
    platform?: MicrogravityPlatform;
    min_oxygen?: number;
  };
}

export interface ChatResponse {
  conversation_id: string;
  message: string;
  citations: Citation[];
  suggested_followups?: string[];
}

export interface BackendHealthResponse {
  status: "ok" | "degraded" | "offline";
  service: string;
  version: string;
  environment: string;
  fastapi_version?: string;
  rag_engine_status?: string;
  timestamp: string;
}
