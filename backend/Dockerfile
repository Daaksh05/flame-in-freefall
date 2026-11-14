# Flame in Freefall backend: FastAPI + local RAG (ChromaDB + Ollama).
#
# NOTE: this bundles a CPU-run 8B-parameter LLM. On Railway's free/hobby tier
# (shared vCPU, no GPU) chat responses can take significantly longer than the
# local dev experience. Mount a persistent volume at /root/.ollama so model
# weights (~5GB) are cached across restarts instead of re-downloaded every boot.
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates zstd \
    && rm -rf /var/lib/apt/lists/*

# Official Ollama install script (Linux binary)
RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend
COPY data ./data

RUN chmod +x /app/backend/entrypoint.sh

WORKDIR /app/backend
ENV PYTHONPATH=/app/backend
ENV OLLAMA_HOST=0.0.0.0:11434

EXPOSE 8000
CMD ["/app/backend/entrypoint.sh"]
