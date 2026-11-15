# Flame in Freefall

AI-powered dashboard analyzing NASA's microgravity combustion research to surface fire-safety
insights for spacecraft design and future Moon/Mars missions.

**NASA Space Apps Challenge 2026 — Paris, France** · Team Elaris

## What it does

In microgravity, there's no buoyant convection — the force that makes flames rise, cool, and
self-limit on Earth. Materials that are safe in a 1g lab can sustain combustion at oxygen
concentrations that would self-extinguish on the ground. Flame in Freefall turns NASA's archival
microgravity combustion research into a usable fire-safety tool:

- **Fire-Safety Insights** — ranked risk table across the dataset, with a composite Fire Risk
  Index per material and the dataset's critical-risk findings surfaced up front.
- **Experiment Browser** — filter all 51 real test conditions by material, oxygen concentration,
  and platform; every row traces back to a real NASA report.
- **Side-by-Side Comparison** — compare 2–3 experiments at once across flame spread, extinction
  velocity, and oxygen concentration.
- **AI Research Assistant** — a retrieval-augmented (RAG) chat assistant that answers questions in
  plain language, grounded only in the indexed NASA reports, with inline citations and direct
  links back to the source NTRS record on every claim.

No fabricated data anywhere in the product — every number on the dashboard and every assistant
answer traces back to a real NASA Technical Reports Server (NTRS) document.

## Data sources

Built from NASA Technical Reports Server documents across three microgravity combustion programs:

- **BASS** — Burning and Suppression of Solids, early ISS flame-spread testing
- **BASS-II** — follow-on program (NASA/TM-20210011385), opposed-flow and axial stagnation
  flammability boundaries
- **Confined Combustion** — effects of enclosure geometry on flame spread in microgravity

51 structured test conditions across 13 materials, extracted from 6 indexed NTRS reports. See
`data/processed/experiments.csv` for the structured data and `data/raw/reports/` for the source
report text used by the RAG pipeline.

## How it works

```
NTRS report PDFs → structured test-condition records → Fire Risk Index + ChromaDB vector index → risk rankings + RAG answers
```

1. **Ingest** — NTRS report PDFs are text-extracted and parsed into structured records (material,
   oxygen %, flow velocity, outcome).
2. **Score** — each material's flammability (minimum sustaining O₂) and persistence (extinction
   velocity) are normalized and combined into a composite Fire Risk Index:
   `risk_score = (0.6 × flammability_norm + 0.4 × persistence_norm) × 100`
3. **Ground** — the same reports are embedded into a local ChromaDB vector store, queried by a
   locally-run LLM (Ollama) so the research assistant only answers from indexed NASA literature.

## Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS — repo root
- **Backend**: FastAPI (Python) — `backend/`
- **RAG**: ChromaDB (vector store) + Ollama running `llama3.1:8b` (chat) and `nomic-embed-text`
  (embeddings) locally in development; the deployed instance keeps embeddings local and can route
  chat generation through Groq's free hosted API for responsive inference (see Deployment below)
- **Data processing**: pandas, pypdf

## Running it locally

**Backend**
```bash
cd backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

**RAG models** (one-time, needs [Ollama](https://ollama.com) installed)
```bash
ollama serve
ollama pull llama3.1:8b
ollama pull nomic-embed-text
curl -X POST http://localhost:8000/chat/reindex   # indexes data/raw/reports/*.txt
```

**Frontend** (repo root)
```bash
npm install
npm run dev
```

Dashboard: http://localhost:3000 · API: http://localhost:8000 · API docs: http://localhost:8000/docs

## API

| Endpoint | Description |
|---|---|
| `GET /api/v1/experiments` | List/filter experiments (`material`, `platform`, oxygen range) |
| `GET /api/v1/experiments/{id}` | Single experiment |
| `GET /api/v1/experiments/materials` | Distinct materials in the dataset |
| `GET /api/v1/experiments/platforms` | Distinct platforms in the dataset |
| `POST /api/v1/experiments/compare` | Compare a list of experiment IDs |
| `GET /api/v1/insights/fire-safety` | Fire-safety insight cards per material |
| `GET /api/v1/insights/risk-ranking` | Materials ranked by composite Fire Risk Index |
| `GET /api/v1/metrics/summary` | Dataset-wide stats (experiment count, materials, platforms) |
| `POST /api/v1/assistant/chat` | Ask a question, answered via RAG over the indexed reports |
| `GET /api/v1/assistant/citations` | List available citations |
| `GET /health` | Backend + RAG index health check |

## Deployment

Configured for Vercel (frontend) + Railway (backend) — see `railway.toml` and
`backend/Dockerfile`. Set `NEXT_PUBLIC_API_URL` on Vercel to the deployed backend URL, and
`ALLOWED_ORIGINS` on Railway to the deployed frontend URL.

`llama3.1:8b` needs ~5-6GB RAM to run, which exceeds low-memory hosting tiers, and even a smaller
local model is too slow for interactive use on a constrained shared vCPU. Local development runs
fully local (`llama3.1:8b` chat + `nomic-embed-text` embeddings via Ollama, no external API). The
deployed instance keeps embeddings local (one cheap call per query) but routes chat generation
through a hosted API for responsive answers — set `GROQ_API_KEY` (free tier, low-latency; optionally
`GROQ_MODEL`, default `openai/gpt-oss-20b`) or `OPENROUTER_API_KEY` as a paid fallback; without
either, the deployed instance falls back to a smaller local model via `OLLAMA_CHAT_MODEL`
(e.g. `qwen2.5:0.5b`).

## Attribution

Imagery and source data courtesy of NASA. This is an independent hackathon project built for the
NASA Space Apps Challenge, not an official NASA product.
