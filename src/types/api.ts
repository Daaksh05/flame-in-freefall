/**
 * NASA Microgravity Combustion Data & API Type Definitions
 * "Flame in Freefall" Dashboard
 */

export type MicrogravityPlatform =
  | "ISS_CIR"           // Combustion Integrated Rack on the ISS (ACME, BASS, CIR-SOFIE)
  | "DROP_TOWER_2_2S"   // NASA Glenn 2.2-second Drop Tower
  | "ZERO_G_FACILITY"   // NASA Glenn 5.18-second Zero-G Facility
  | "PARABOLIC_FLIGHT"  // Reduced gravity aircraft
  | "SOUNDING_ROCKET";  // Suborbital microgravity flight

export type MaterialCategory =
  | "Polymers (PMMA, PE)"
  | "Fabrics & Textiles (Nomex, Cotton)"
  | "Composites & Insulation"
  | "Gaseous Fuels"
  | "Liquid Droplets";

export type FlameExtinctionMode =
  | "Radiative Extinction"
  | "Blowoff"
  | "Quenching"
  | "Fuel Depletion"
  | "Ongoing Combustion";

export interface Experiment {
  id: string;
  name: string;
  test_run: string;
  material: string;
  material_category: MaterialCategory;
  platform: MicrogravityPlatform;
  oxygen_concentration: number;      // percentage, e.g. 21.0 for 21%
  ambient_pressure_kpa: number;      // kPa
  flow_velocity_cm_s: number;        // cm/s (forced ventilation flow)
  flame_spread_rate_mm_s: number | null; // mm/s
  peak_temperature_c: number | null; // Celsius
  burn_duration_s: number | null;    // seconds
  quenching_distance_mm: number | null;
  extinction_mode: FlameExtinctionMode;
  date_conducted: string;            // ISO date string
  chamber_atmosphere: string;        // e.g. "O2 / N2" or "O2 / CO2"
  video_url?: string;                // NASA high-speed imaging URL
  sensor_telemetry_url?: string;
  notes?: string;
}

export interface ExperimentFilterParams {
  material?: string;
  platform?: MicrogravityPlatform | "ALL";
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
  affected_platforms: MicrogravityPlatform[];
  citation_ids: string[];
  created_at: string;
}

export interface SystemMetrics {
  total_experiments: number;
  active_platforms_count: number;
  materials_cataloged: number;
  critical_safety_alerts: number;
  last_telemetry_sync: string;
  average_flame_spread_rate: number;
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
  authors: string[];
  year: number;
  publication: string;
  doi_or_ntrs_id?: string;
  source_url?: string;
  snippet: string;
  relevance_score: number;
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
