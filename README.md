# Flame in Freefall

AI-powered dashboard analyzing NASA's microgravity combustion research to surface fire-safety
insights for spacecraft design and future Moon/Mars missions. NASA Space Apps Challenge 2026, Paris.

## Status

Working end-to-end locally: real NASA report data, a FastAPI backend, a Next.js dashboard, and a
local-LLM RAG chat panel grounded in the source reports.

- **51 real experiment rows** extracted from 5 NASA documents across 3 research programs: BASS-II
  (fabric flammability table + PMMA rod/sheet results, NASA/TM-20210011385), BASS-I opposed-flow
  tests, and the Confined Combustion (CCF) baffle-spacing study. See `data/processed/experiments.csv`.
- **Composite Fire Risk Index** (`/insights/risk-index`) — per-material score combining flammability
  O2 limit and extinction-velocity persistence, with a ranked bar chart and an
  extinction-velocity-vs-O2% scatter on the dashboard.
- **RAG chat** indexed over the full text of six public NASA reports, ~750 paragraph-aware chunks,
  answering questions with citations back to the source report (`llama3.1:8b` + `nomic-embed-text`
  via Ollama, fully local).
- Note: FLEX's quantitative results (burn rates, extinction diameters) exist only as plotted
  figures in the PDF, not as extractable text — so FLEX currently powers RAG Q&A only, not the
  structured experiment table.

## Stack

- **Backend**: FastAPI (Python) — `backend/`
- **Frontend**: Next.js 16 / React / Tailwind — `frontend/`
- **RAG**: ChromaDB + Ollama (`llama3.1:8b` for chat, `nomic-embed-text` for embeddings), fully local
- **Charts**: Recharts
- **Data**: `data/processed/experiments.csv` (structured), `data/raw/reports/*.txt` (full report
  text for RAG)

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
ollama pull llama3.1:8b
ollama pull nomic-embed-text
curl -X POST http://localhost:8000/chat/reindex   # indexes data/raw/reports/*.txt
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Dashboard: http://localhost:3000 · API: http://localhost:8000

## API

| Endpoint | Description |
|---|---|
| `GET /experiments` | List/filter experiments (`material`, `platform`, `gravity_level`) |
| `GET /experiments/{id}` | Single experiment |
| `POST /experiments/compare` | Compare a list of experiment IDs |
| `GET /insights/summary` | Dataset-wide stats |
| `GET /insights/ranking` | Hardest-to-extinguish experiments (highest extinction velocity) |
| `GET /insights/risk-index` | Composite fire-safety risk score per material |
| `POST /chat` | Ask a question, answered via RAG over the indexed reports |
| `POST /chat/reindex` | Re-index `data/raw/reports/*.txt` into Chroma |

## Next up

- [ ] Frontend filter/compare controls (backend already supports it)
- [ ] More data sources — more NTRS reports, the Mendeley microgravity-combustion classification
      dataset
- [ ] Deploy for demo day (frontend + backend currently localhost-only)
