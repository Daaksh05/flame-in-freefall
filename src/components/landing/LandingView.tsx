"use client";

import Link from "next/link";
import Image from "next/image";
import { FlameLogo } from "@/components/common/FlameLogo";

const NAV_LINKS = [
  { label: "Overview", href: "/overview" },
  { label: "Experiments", href: "/experiments" },
  { label: "Comparison", href: "/comparison" },
  { label: "Assistant", href: "/assistant" },
];

const STATS = [
  { value: "51", label: "Real NASA test conditions", detail: "BASS, BASS-II & Confined Combustion" },
  { value: "13", label: "Materials cataloged", detail: "Distinct substrates in the dataset" },
  { value: "2", label: "Microgravity platforms", detail: "ISS Microgravity Science Glovebox + Ground" },
];

const FEATURES = [
  {
    title: "Fire risk index",
    body: "Materials ranked by a composite of flammability (minimum sustaining O₂) and persistence (extinction velocity), surfaced for fast triage.",
  },
  {
    title: "Experiment browser",
    body: "Filter 51 archival NASA test runs by material, oxygen concentration, and platform — every record traces back to a real NTRS report.",
  },
  {
    title: "RAG research assistant",
    body: "Ask questions in plain language and get answers grounded only in indexed NASA Technical Reports Server literature, with inline citations.",
  },
];

export function LandingView() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <FlameLogo className="h-9 w-9" />
            <span className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
              Flame in Freefall
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-[#EA580C]">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/overview"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #FB923C 0%, #EA580C 60%, #C2410C 100%)" }}
          >
            Enter Dashboard
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF4EC] px-3 py-1 text-xs font-semibold text-[#EA580C]">
              NASA Space Apps Challenge
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-5xl">
              Fire safety intelligence for{" "}
              <span style={{ color: "#EA580C" }}>freefall</span> environments
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
              In microgravity, weak ventilation and reduced buoyancy can sustain dangerous flame
              corridors while suppressing normal cooling. Flame in Freefall turns real NASA
              combustion test data into fire-risk rankings, comparison tools, and a research
              assistant grounded in NASA Technical Reports Server literature.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/overview"
                className="rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #FB923C 0%, #EA580C 60%, #C2410C 100%)" }}
              >
                Enter Dashboard
              </Link>
              <Link
                href="/assistant"
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Ask the Research Assistant
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <Image
              src="/images/bass-flame-iss.jpg"
              alt="Composite image of flames from the Burning and Suppression of Solids (BASS) experiment aboard the International Space Station"
              width={1277}
              height={1481}
              className="h-full w-full object-cover"
              priority
            />
            <p className="border-t border-slate-200 bg-[#FFF4EC] px-4 py-2 text-xs text-slate-500">
              BASS experiment flames aboard the ISS — Image Credit: NASA
            </p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#f8f7f4]">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-3xl font-semibold tracking-[-0.02em]" style={{ color: "#EA580C" }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{stat.label}</div>
                <div className="mt-1 text-xs text-slate-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            Built on real NASA research
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Every figure in this dashboard traces back to an indexed NASA Technical Reports
            Server document — no fabricated experiments, no invented metrics.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f8f7f4]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FlameLogo className="h-7 w-7" />
                <span className="text-sm font-semibold text-slate-900">Flame in Freefall</span>
              </div>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                A NASA Space Apps Challenge project analyzing microgravity combustion research
                for spacecraft fire-safety insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs text-slate-500 sm:grid-cols-3">
              <div>
                <div className="mb-2 font-semibold text-slate-700">Dashboard</div>
                <ul className="space-y-1.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-[#EA580C]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 font-semibold text-slate-700">Data sources</div>
                <ul className="space-y-1.5">
                  <li>NASA Technical Reports Server (NTRS)</li>
                  <li>BASS / BASS-II experiments</li>
                  <li>Confined Combustion program</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Imagery and source data courtesy of NASA. This is an independent hackathon project, not an official NASA product.</span>
            <span>&copy; {new Date().getFullYear()} Flame in Freefall</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
