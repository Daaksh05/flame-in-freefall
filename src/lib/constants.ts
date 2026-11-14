import { MicrogravityPlatform } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const PLATFORM_INFO: Record<
  MicrogravityPlatform,
  { label: string; shortName: string; duration: string; description: string }
> = {
  ISS_CIR: {
    label: "ISS Combustion Integrated Rack",
    shortName: "ISS CIR",
    duration: "Long-Duration (Days/Months)",
    description: "Multi-user combustion facility in Destiny module (ACME, BASS, SOFIE)",
  },
  ZERO_G_FACILITY: {
    label: "NASA Glenn 5.18s Zero-G Facility",
    shortName: "5.18s Drop Tower",
    duration: "5.18 seconds (10^-5 g)",
    description: "Deep vacuum drop chamber in Cleveland, OH for pure quiescent freefall",
  },
  DROP_TOWER_2_2S: {
    label: "NASA Glenn 2.2s Drop Tower",
    shortName: "2.2s Drop Tower",
    duration: "2.2 seconds",
    description: "Rapid iteration combustion rig testing at NASA GRC",
  },
  PARABOLIC_FLIGHT: {
    label: "Zero-G Parabolic Flight",
    shortName: "Parabolic Aircraft",
    duration: "20-25 seconds per parabola",
    description: "Aircraft trajectory simulation for testing equipment & partial gravity",
  },
  SOUNDING_ROCKET: {
    label: "Suborbital Sounding Rocket",
    shortName: "Sounding Rocket",
    duration: "6-15 minutes",
    description: "Suborbital high-vacuum microgravity combustion flights",
  },
};

export const COMMON_MATERIALS = [
  "PMMA (Polymethyl Methacrylate)",
  "Polyethylene (PE)",
  "Nomex / Kevlar Blend",
  "Cotton/Fiberglass Fabric",
  "Silicone Rubber Elastomer",
  "Tefzel (ETFE Insulation)",
  "Polyurethane Foam",
  "Solid Methane Hydrate",
];

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
