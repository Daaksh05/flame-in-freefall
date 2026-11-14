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

const STAKES = [
  {
    title: "Weak ventilation, stronger flames",
    body: "Without buoyant convection to pull hot gas away, flames can sustain at oxygen levels that would self-extinguish on Earth.",
  },
  {
    title: "Cooling doesn't happen for free",
    body: "On the ground, hot air rises and drags in fresh oxygen automatically. In freefall, that mechanism disappears — airflow has to be engineered in.",
  },
  {
    title: "Material choice becomes a safety decision",
    body: "The same polymer that is low-risk in a 1g lab can sustain combustion down to much lower oxygen concentrations aboard a spacecraft.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Ingest real NASA reports",
    body: "NTRS technical reports from the BASS, BASS-II, and Confined Combustion programs are parsed into structured test-condition records — material, oxygen %, flow velocity, outcome.",
  },
  {
    step: "02",
    title: "Compute the Fire Risk Index",
    body: "Each material's flammability (how little O₂ it needs to sustain a flame) and persistence (how much airflow it takes to blow the flame out) are normalized and combined into one composite score.",
  },
  {
    step: "03",
    title: "Ground the AI assistant in evidence",
    body: "The same reports are embedded into a local vector store (ChromaDB) so the research assistant answers only from indexed NASA literature, with a citation and NTRS link on every claim.",
  },
];

const REFERENCES = [
  {
    title: "Detailed Results From the Flame Extinguishment Experiment (FLEX), March 2009 to December 2011",
    publication: "NASA/TP-2015-216046",
    url: "https://ntrs.nasa.gov/citations/20150023456",
  },
  {
    title: "Burning and Suppression of Solids-II (BASS-II) Summary Report",
    publication: "NASA/TM-20210011385",
    url: "https://ntrs.nasa.gov/citations/20210011385",
  },
  {
    title: "BASS-II Flame Spread Results (Olson, Takahashi, T'ien)",
    publication: "NTRS 20160000593",
    url: "https://ntrs.nasa.gov/citations/20160000593",
  },
  {
    title: "Flammability Aspects of a Cotton-Fiberglass Fabric in Opposed and Concurrent Airflow in Microgravity",
    publication: "NTRS 20130012832",
    url: "https://ntrs.nasa.gov/citations/20130012832",
  },
  {
    title: "Concurrent Flame Growth, Spread and Extinction Over Composite Fabric Samples in Low Speed Purely Forced Flow in Microgravity",
    publication: "NTRS 20150008962",
    url: "https://ntrs.nasa.gov/citations/20150008962",
  },
  {
    title: "Effects of Confinement on Flame Spread in Microgravity",
    publication: "NTRS 20205004657 (ICES-2020-407)",
    url: "https://ntrs.nasa.gov/citations/20205004657",
  },
];

const RELATED_RESEARCH = [
  {
    title: "Flame Spread and Heat Transfer over Discrete Fuels separated by Metal Barriers under Microgravity",
    authors: "Ries, Krieger, Meyer & Eigenbrod — ZARM drop tower experiments",
    publication: "Proceedings of the Combustion Institute, 2026 (DOI: 10.1016/j.proci.2026.106483)",
    url: "https://zenodo.org/records/18479713",
  },
];

const FAQS = [
  {
    q: "What does \"microgravity\" actually change about a flame?",
    a: "On Earth, hot combustion gas rises and pulls in fresh air — that's why flames are teardrop-shaped. In freefall there's no buoyancy, so flames spread by diffusion and any imposed airflow alone, often burning slower but at lower oxygen concentrations than would sustain a flame on the ground.",
  },
  {
    q: "What is the Fire Risk Index, exactly?",
    a: "A 0–100 composite score per material: 60% weighted on flammability (inverse of the lowest O₂ concentration that still sustains a flame) and 40% on persistence (the highest airflow velocity recorded before the flame extinguished). Materials missing one signal are scored on the other alone.",
  },
  {
    q: "Where does the underlying data come from?",
    a: "Every test condition in this dashboard is extracted from a real NASA Technical Reports Server (NTRS) document — BASS, BASS-II, and Confined Combustion program reports. Nothing is simulated or invented; records with missing fields are shown as unavailable rather than filled in.",
  },
  {
    q: "How is the AI assistant prevented from hallucinating?",
    a: "It's a retrieval-augmented generation (RAG) pipeline: the model only answers from report text actually retrieved from the indexed NTRS documents for that query, and cites the source document for each claim. If the reports don't cover something, it says so instead of guessing.",
  },
  {
    q: "Is this only useful for spacecraft design?",
    a: "The primary use case is fire-safety material selection for crewed spacecraft and habitats, but the same oxygen-limit and extinction-velocity data is also relevant to anyone studying combustion behavior outside the influence of gravity.",
  },
];

function FlameShapeDiagram() {
  return (
    <svg viewBox="0 0 520 360" className="h-full w-full" role="img" aria-label="Diagram comparing a teardrop-shaped flame on Earth to a spherical, dimmer flame in microgravity">
      <rect width="520" height="360" fill="#0b0b10" />
      <line x1="260" y1="20" x2="260" y2="340" stroke="#27272a" strokeWidth="1" strokeDasharray="4 6" />

      {/* Earth gravity panel */}
      <text x="130" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#e5e7eb" fontFamily="system-ui">
        On Earth (1g)
      </text>
      <path
        d="M130 280 C95 240 100 190 130 150 C160 190 165 240 130 280 Z"
        fill="url(#earthFlame)"
      />
      <ellipse cx="130" cy="285" rx="34" ry="8" fill="#1c1917" />
      <text x="130" y="320" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="system-ui">
        Buoyancy pulls hot gas up —
      </text>
      <text x="130" y="336" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="system-ui">
        teardrop shape, self-cooling
      </text>

      {/* Microgravity panel */}
      <text x="390" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#e5e7eb" fontFamily="system-ui">
        In Microgravity
      </text>
      <circle cx="390" cy="210" r="42" fill="url(#microFlame)" />
      <ellipse cx="390" cy="285" rx="34" ry="8" fill="#1c1917" />
      <text x="390" y="320" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="system-ui">
        No buoyancy — spherical,
      </text>
      <text x="390" y="336" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="system-ui">
        diffusion-driven, can persist at lower O₂
      </text>

      <defs>
        <radialGradient id="earthFlame" cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="45%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="microFlame" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="55%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </radialGradient>
      </defs>
    </svg>
  );
}

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

        {/* Why This Matters */}
        <section className="border-y border-slate-200 bg-[#f8f7f4]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <FlameShapeDiagram />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF4EC] px-3 py-1 text-xs font-semibold text-[#EA580C]">
                PREPARING SPACECRAFT FOR DEEP SPACE
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
                <span style={{ color: "#EA580C" }}>Why</span> this matters for human spaceflight
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Long-duration spaceflight removes buoyant convection — the force that makes flames
                rise, cool, and self-limit on Earth. Without it, combustion behaves differently in
                ways that standard ground-based fire-safety testing can miss.
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                What&apos;s at stake?
              </p>
              <div className="mt-3 space-y-4">
                {STAKES.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF4EC] px-3 py-1 text-xs font-semibold text-[#EA580C]">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
            3 steps from NASA report to risk ranking
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rounded-3xl border border-slate-200 p-6">
                <span className="text-xs font-semibold text-[#EA580C]">{step.step}</span>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#FED7AA] bg-[#FFF4EC] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EA580C]">
              Fire risk index formula
            </p>
            <p className="mt-3 font-mono text-sm text-slate-800">
              risk_score = (0.6 × flammability_norm + 0.4 × persistence_norm) × 100
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              flammability_norm inverts the material&apos;s lowest sustaining O₂% (lower threshold ={" "}
              higher risk); persistence_norm is its highest recorded extinction velocity (more
              airflow needed to blow the flame out = higher risk). Both are min–max normalized
              across the dataset before weighting. A material missing one signal is scored on the
              other alone.
            </p>
          </div>
        </section>

        {/* Case Study */}
        <section className="border-y border-slate-200 bg-[#f8f7f4]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-white px-3 py-1 text-xs font-semibold text-[#EA580C]">
              EXAMPLE FROM THE DATASET
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
              The dataset&apos;s most critical material
            </h2>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-[#FFE4CC] px-2.5 py-1 text-[10px] font-semibold text-[#9A3412]">
                    CRITICAL RISK · RANK #1 OF 11
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    PMMA rod (clear/black, r=0.318–0.635 cm)
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    BASS-II axial stagnation flow flammability boundary test, ISS Microgravity
                    Science Glovebox
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold" style={{ color: "#EA580C" }}>
                    13.5% O₂
                  </div>
                  <div className="text-xs text-slate-500">Lowest sustaining oxygen concentration</div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-600">
                In microgravity, this PMMA sample sustained a flame down to an oxygen concentration
                of just 13.5% — well below Earth&apos;s ambient 21% and below what would sustain
                combustion for most materials in a 1g lab test. It is the single lowest flammability
                limit recorded anywhere in this dataset, making it the clearest real example of why
                ground-based flammability testing alone can understate risk in freefall.
              </p>

              <a
                href="https://ntrs.nasa.gov/citations/20210011385"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] hover:underline"
              >
                View NTRS record — NASA/TM-20210011385 (BASS-II Summary Report) →
              </a>
            </div>
          </div>
        </section>

        {/* Data Sources & Process */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF4EC] px-3 py-1 text-xs font-semibold text-[#EA580C]">
            BEHIND THE DASHBOARD
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
            Data sources &amp; process
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            We use NASA Technical Reports Server documents from three microgravity combustion
            programs as primary input:
          </p>

          <ul className="mt-4 max-w-2xl space-y-2 text-sm text-slate-600">
            <li>
              <span className="font-semibold text-slate-900">BASS</span> — Burning and Suppression
              of Solids, early ISS flame-spread testing
            </li>
            <li>
              <span className="font-semibold text-slate-900">BASS-II</span> — follow-on program
              (NASA/TM-20210011385), opposed-flow and axial stagnation flammability boundaries
            </li>
            <li>
              <span className="font-semibold text-slate-900">Confined Combustion</span> — effects
              of enclosure geometry on flame spread in microgravity
            </li>
          </ul>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">
            Report PDFs are text-extracted and parsed into structured test-condition records
            (material, oxygen %, flow velocity, outcome), which feed both the Fire Risk Index
            computation and a ChromaDB vector index queried by a locally-run LLM (Ollama) for the
            research assistant — so every number and every answer traces back to a real document.
          </p>

          <a
            href="https://ntrs.nasa.gov/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] hover:underline"
          >
            Browse NASA Technical Reports Server →
          </a>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 bg-[#f8f7f4]">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-white px-3 py-1 text-xs font-semibold text-[#EA580C]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
              Common questions answered
            </h2>

            <div className="mt-8 space-y-3">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#FED7AA]"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-[#EA580C] transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* References */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF4EC] px-3 py-1 text-xs font-semibold text-[#EA580C]">
              REFERENCES
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
              Source research papers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Every NASA Technical Reports Server document indexed to build this dataset and ground
              the research assistant, cited directly.
            </p>

            <ol className="mt-8 space-y-3">
              {REFERENCES.map((ref, i) => (
                <li
                  key={ref.url}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition-colors hover:border-[#FED7AA] hover:bg-[#FFF4EC]"
                >
                  <span className="mt-0.5 text-sm font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-slate-900 hover:text-[#EA580C] hover:underline"
                    >
                      {ref.title}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">{ref.publication}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 text-lg font-semibold tracking-[-0.01em] text-slate-900">
              Related external research
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Not part of this dataset or pipeline, but directly relevant further reading on
              microgravity solid-fuel combustion.
            </p>
            <ul className="mt-4 space-y-3">
              {RELATED_RESEARCH.map((ref) => (
                <li
                  key={ref.url}
                  className="rounded-2xl border border-dashed border-slate-300 p-5 transition-colors hover:border-[#FED7AA] hover:bg-[#FFF4EC]"
                >
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-900 hover:text-[#EA580C] hover:underline"
                  >
                    {ref.title}
                  </a>
                  <p className="mt-1 text-xs text-slate-500">{ref.authors}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{ref.publication}</p>
                </li>
              ))}
            </ul>
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
