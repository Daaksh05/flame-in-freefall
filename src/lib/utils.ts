import { MicrogravityPlatform } from "@/types";
import { PLATFORM_INFO } from "./constants";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPlatform(platform: MicrogravityPlatform): string {
  return PLATFORM_INFO[platform]?.shortName || platform;
}

export function formatRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return "N/A";
  return `${rate.toFixed(2)} mm/s`;
}

export function formatOxygen(conc: number | null | undefined): string {
  if (conc === null || conc === undefined) return "N/A";
  return `${conc.toFixed(1)}% O₂`;
}

export function formatPressure(kpa: number | null | undefined): string {
  if (kpa === null || kpa === undefined) return "N/A";
  return `${kpa.toFixed(1)} kPa`;
}

export function formatFlow(flow: number | null | undefined): string {
  if (flow === null || flow === undefined) return "N/A";
  if (flow === 0) return "Quiescent (0 cm/s)";
  return `${flow.toFixed(1)} cm/s`;
}

export function getSeverityColor(severity: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return {
        bg: "bg-red-950/60",
        text: "text-red-400",
        border: "border-red-800/80",
        dot: "bg-red-500",
      };
    case "HIGH":
      return {
        bg: "bg-orange-950/60",
        text: "text-orange-400",
        border: "border-orange-800/80",
        dot: "bg-orange-500",
      };
    case "ELEVATED":
      return {
        bg: "bg-amber-950/60",
        text: "text-amber-300",
        border: "border-amber-800/80",
        dot: "bg-amber-400",
      };
    case "NOMINAL":
    default:
      return {
        bg: "bg-emerald-950/60",
        text: "text-emerald-400",
        border: "border-emerald-800/80",
        dot: "bg-emerald-400",
      };
  }
}
