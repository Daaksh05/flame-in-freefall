#!/bin/sh
set -e

echo "Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

echo "Waiting for Ollama to be ready..."
until curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; do
  sleep 1
done

CHAT_MODEL="${OLLAMA_CHAT_MODEL:-llama3.1:8b}"
echo "Pulling models (nomic-embed-text, ${CHAT_MODEL}) -- first boot can take several minutes..."
ollama pull nomic-embed-text
ollama pull "${CHAT_MODEL}"

echo "Starting FastAPI..."
uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" &
UVICORN_PID=$!

echo "Waiting for API to be ready..."
until curl -sf "http://127.0.0.1:${PORT:-8000}/health" >/dev/null 2>&1; do
  sleep 1
done

if curl -sf "http://127.0.0.1:${PORT:-8000}/health" | grep -q '"rag_engine_status":"indexed"'; then
  echo "ChromaDB already indexed (shipped with the image) -- skipping reindex."
else
  echo "Indexing NASA reports into ChromaDB -- this embeds every chunk and can be slow on constrained CPUs..."
  curl -sf -X POST "http://127.0.0.1:${PORT:-8000}/chat/reindex" || echo "Reindex request failed -- continuing with whatever index (if any) is already on disk."
fi

wait "$UVICORN_PID"
