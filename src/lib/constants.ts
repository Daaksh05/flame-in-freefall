export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Real platforms present in the extracted dataset (see backend/app/routers/api_v1.py).
export const PLATFORM_INFO: Record<
  string,
  { label: string; shortName: string; duration: string; description: string }
> = {
  "ISS-MSG": {
    label: "ISS Microgravity Science Glovebox",
    shortName: "ISS MSG",
    duration: "Long-Duration (minutes to days)",
    description: "Glovebox facility in the Destiny module used for BASS, BASS-II and Confined Combustion",
  },
  Ground: {
    label: "Ground (1g comparison)",
    shortName: "Ground",
    duration: "N/A",
    description: "Normal-gravity baseline tests used for comparison against the microgravity results",
  },
};

export const NAV_LINKS = [
  {
    label: "Overview & Fire Safety",
    href: "/overview",
    description: "Mission metrics and critical flammability limits",
  },
  {
    label: "Experiment Browser",
    href: "/experiments",
    description: "Search and filter microgravity combustion test runs",
  },
  {
    label: "Comparison View",
    href: "/comparison",
    description: "Side-by-side run analysis and delta metrics",
  },
  {
    label: "AI Research Assistant",
    href: "/assistant",
    description: "RAG citation engine for NASA technical reports",
  },
];
