# Flame in Freefall

AI-powered dashboard analyzing NASA's microgravity combustion research to surface fire-safety
insights for spacecraft design and future Moon/Mars missions. NASA Space Apps Challenge 2026, Paris.

## Status

Working end-to-end locally: real NASA report data, a FastAPI backend, a Next.js dashboard, and a
local-LLM RAG chat panel grounded in the source reports.

- **46 real experiment rows** extracted from NASA's BASS-II technical memorandum
  (NASA/TM-20210011385) — a 30-test fabric flammability table plus aggregated PMMA rod/sheet
  results from four other PI sections. See `data/processed/experiments.csv`.
- **RAG chat** indexed over the full text of three public NASA reports (FLEX and BASS-II/BASS),
  ~900 chunks, answering questions with citations back to the source report.
- Note: FLEX's quantitative results (burn rates, extinction diameters) exist only as plotted
  figures in the PDF, not as extractable text — so FLEX currently powers RAG Q&A only, not the
  structured experiment table.

## Stack

- **Backend**: FastAPI (Python) — `backend/`
- **Frontend**: Next.js 16 / React / Tailwind — `frontend/`
- **RAG**: ChromaDB + Ollama (`llama3.2` for chat, `nomic-embed-text` for embeddings), fully local
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
ollama pull llama3.2
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
| `POST /chat` | Ask a question, answered via RAG over the indexed reports |
| `POST /chat/reindex` | Re-index `data/raw/reports/*.txt` into Chroma |

## Next up

- [ ] Frontend filter/compare controls (backend already supports it)
- [ ] More data sources — more NTRS reports, the Mendeley microgravity-combustion classification
      dataset
- [ ] UI polish for the demo
