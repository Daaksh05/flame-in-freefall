const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Experiment = {
  experiment_id: string;
  program: string;
  task: string;
  platform: string;
  material: string;
  sample_width_cm: number | null;
  oxygen_pct: number | null;
  oxygen_pct_min: number | null;
  oxygen_pct_max: number | null;
  flow_velocity_cm_s: number | null;
  flow_final_cm_s: number | null;
  extinction_velocity_cm_s: number | null;
  flame_spread_rate_mm_s: number | null;
  rod_regression_rate_mm_s: number | null;
  outcome: string;
  gravity_level: string;
  source_report: string;
  notes: string | null;
  extinguished: boolean;
};

export type Summary = {
  total_experiments: number;
  programs: string[];
  materials: string[];
  avg_extinction_velocity_cm_s: number;
  extinguished_rate_pct: number;
};

export async function fetchExperiments(): Promise<Experiment[]> {
  const res = await fetch(`${API_URL}/experiments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch experiments");
  return res.json();
}

export async function fetchSummary(): Promise<Summary> {
  const res = await fetch(`${API_URL}/insights/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchRanking(limit = 10): Promise<Experiment[]> {
  const res = await fetch(`${API_URL}/insights/ranking?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch ranking");
  return res.json();
}

export async function askQuestion(question: string): Promise<{ answer: string; sources: string[] }> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to get answer");
  return res.json();
}
