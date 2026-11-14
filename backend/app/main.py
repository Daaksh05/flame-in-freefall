import os
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import api_v1, chat, experiments, insights
from app.services.rag import _get_collection

app = FastAPI(title="Flame in Freefall API")

# Comma-separated list of allowed origins, e.g. "https://flame-in-freefall.vercel.app,http://localhost:3000"
_allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in _allowed_origins.split(",") if origin.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiments.router)
app.include_router(insights.router)
app.include_router(chat.router)
app.include_router(api_v1.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "flame-in-freefall-api"}


@app.get("/health")
def health():
    try:
        rag_status = "indexed" if _get_collection().count() > 0 else "not_indexed"
    except Exception:
        rag_status = "unavailable"

    return {
        "status": "ok",
        "service": "flame-in-freefall-api",
        "version": "0.1.0",
        "environment": "development",
        "rag_engine_status": rag_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
