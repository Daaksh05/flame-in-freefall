"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  GitCompare,
  Sparkles,
  Server,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { checkBackendHealth } from "@/services/healthService";
import { API_BASE_URL } from "@/lib/constants";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  tag: string;
}

const navItems: NavItem[] = [
  {
    name: "Fire-Safety Insights",
    href: "/overview",
    icon: LayoutDashboard,
    badge: "Alerts",
    tag: "Thresholds & LOI",
  },
  {
    name: "Experiment Browser",
    href: "/experiments",
    icon: Layers,
    tag: "BASS / BASS-II Runs",
  },
  {
    name: "Side-by-Side Comparison",
    href: "/comparison",
    icon: GitCompare,
    badge: "2-3 Runs",
    tag: "Multi-Run Delta",
  },
  {
    name: "AI Research Assistant",
    href: "/assistant",
    icon: Sparkles,
    badge: "RAG",
    tag: "NTRS Citations",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkHealth() {
      try {
        await checkBackendHealth();
        if (mounted) setBackendOnline(true);
      } catch {
        if (mounted) setBackendOnline(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside
      className={`flex-shrink-0 border-r border-slate-200 bg-[#f8f7f4] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex h-screen flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <Link href="/overview" className="flex items-center gap-3 overflow-hidden">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
                style={{ background: "linear-gradient(145deg, #FB923C 0%, #EA580C 55%, #9A3412 100%)" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.5c.6 2.4-.4 3.9-1.8 5.4-1.6 1.7-2.9 3.3-2.9 5.6a4.7 4.7 0 0 0 9.4 0c0-1.2-.4-2.1-1-3 .1 1.3-.4 2.2-1.1 2.8-.2-1.6-1-2.5-2-3.4-.7-.6-.9-1.5-.6-2.4.3.5.9.9 1.5 1 .2-2.3-.7-4.1-1.5-6Z"
                    fill="#FFEDD5"
                  />
                  <path
                    d="M12 2.5c.6 2.4-.4 3.9-1.8 5.4-1.6 1.7-2.9 3.3-2.9 5.6a4.7 4.7 0 0 0 9.4 0c0-1.2-.4-2.1-1-3 .1 1.3-.4 2.2-1.1 2.8-.2-1.6-1-2.5-2-3.4-.7-.6-.9-1.5-.6-2.4.3.5.9.9 1.5 1 .2-2.3-.7-4.1-1.5-6Z"
                    fill="url(#flame-core)"
                    fillOpacity="0.9"
                  />
                  <defs>
                    <linearGradient id="flame-core" x1="12" y1="2.5" x2="12" y2="18.6" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="45%" stopColor="#FB923C" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-[-0.03em] text-slate-900">
                    Flame In Freefall
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="rounded-full bg-[#FFE4CC] px-1.5 py-0.5 font-medium text-[#EA580C]">
                      Microgravity
                    </span>
                    <span>Fire safety</span>
                  </div>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {!collapsed && (
            <div className="flex items-center justify-between border-b border-slate-200 bg-white/60 px-4 py-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Freefall: 10⁻⁵ g</span>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-medium text-slate-600">
                ISS MSG
              </span>
            </div>
          )}

          <div className="space-y-1 p-3">
            {!collapsed && (
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mission Views
              </div>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/overview" && pathname === "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border border-[#FED7AA] bg-[#FFF4EC] text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#EA580C]" : "text-slate-500"}`} />

                    {!collapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                                isActive
                                  ? "bg-[#FFE8D1] text-[#EA580C]"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[10px] text-slate-500">{item.tag}</p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 bg-white/60 p-3">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} text-xs`}>
            {!collapsed && (
              <div className="flex items-center gap-2 text-slate-600">
                <Server className="h-3.5 w-3.5" />
                <span>FastAPI Backend</span>
              </div>
            )}
            <div className="flex items-center gap-1.5" title={`FastAPI Backend at ${API_BASE_URL}`}>
              <span className={`h-2 w-2 rounded-full ${backendOnline === true ? "bg-emerald-500" : backendOnline === false ? "bg-amber-500" : "bg-slate-400"}`} />
              {!collapsed && (
                <span className={`text-[10px] font-semibold ${backendOnline === true ? "text-emerald-600" : "text-amber-600"}`}>
                  {backendOnline === true ? "LIVE 8000" : "STANDBY"}
                </span>
              )}
            </div>
          </div>

          {!collapsed && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
              <span>localhost:8000</span>
              <span className="font-semibold text-[#EA580C]">REST + RAG</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
