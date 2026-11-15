import os
from pathlib import Path

import chromadb
import httpx
import ollama

CHROMA_DIR = Path(__file__).resolve().parents[3] / "data" / "chroma"
REPORTS_DIR = Path(__file__).resolve().parents[3] / "data" / "raw" / "reports"
EMBED_MODEL = "nomic-embed-text"
CHAT_MODEL = os.environ.get("OLLAMA_CHAT_MODEL", "llama3.1:8b")

# Embeddings always run locally via Ollama (one cheap call per query). Chat
# generation defaults to local Ollama too, but on CPU-constrained hosts
# (e.g. low-memory deploy tiers) that's too slow for interactive use -- set
# OPENROUTER_API_KEY to route generation through OpenRouter's hosted API instead.
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini")


def _chat_completion(prompt: str) -> str:
    if OPENROUTER_API_KEY:
        response = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            json={
                "model": OPENROUTER_MODEL,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    response = ollama.chat(model=CHAT_MODEL, messages=[{"role": "user", "content": prompt}])
    return response["message"]["content"]

_client = chromadb.PersistentClient(path=str(CHROMA_DIR))


def _get_collection():
    return _client.get_or_create_collection("combustion_reports")


def _chunk_text(text: str, target_size: int = 1400, overlap_paragraphs: int = 1) -> list[str]:
    """Group paragraphs into chunks up to target_size, never splitting mid-paragraph.

    A giant single paragraph still gets hard-split as a fallback. Carries the
    last paragraph of each chunk into the next for continuity across boundaries.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for para in paragraphs:
        if current_len + len(para) > target_size and current:
            chunks.append("\n\n".join(current))
            current = current[-overlap_paragraphs:] if overlap_paragraphs else []
            current_len = sum(len(p) for p in current)
        if len(para) > target_size:
            for i in range(0, len(para), target_size):
                chunks.append(para[i : i + target_size])
            current, current_len = [], 0
            continue
        current.append(para)
        current_len += len(para)

    if current:
        chunks.append("\n\n".join(current))
    return chunks


def index_reports() -> int:
    """Chunk and embed every .txt report in data/raw/reports. Returns chunk count indexed."""
    if not REPORTS_DIR.exists():
        return 0

    _client.delete_collection("combustion_reports")
    collection = _client.get_or_create_collection("combustion_reports")

    count = 0
    for report_path in REPORTS_DIR.glob("*.txt"):
        text = report_path.read_text(encoding="utf-8", errors="ignore")
        for i, chunk in enumerate(_chunk_text(text)):
            embedding = ollama.embeddings(model=EMBED_MODEL, prompt=chunk)["embedding"]
            collection.add(
                ids=[f"{report_path.stem}-{i}"],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[{"source": report_path.name}],
            )
            count += 1
    return count


def ask(question: str, n_results: int = 6) -> dict:
    collection = _get_collection()
    if collection.count() == 0:
        return {
            "answer": "No reports indexed yet — run the indexing step once report text is in data/raw/reports.",
            "sources": [],
        }

    query_embedding = ollama.embeddings(model=EMBED_MODEL, prompt=question)["embedding"]
    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)

    context_chunks = results["documents"][0]
    sources = [meta["source"] for meta in results["metadatas"][0]]
    context = "\n\n---\n\n".join(context_chunks)

    prompt = (
        "You are a fire-safety research assistant analyzing NASA microgravity "
        "combustion experiment reports. Answer the question using only the "
        "context below. Cite which source(s) you used. If the context doesn't "
        "contain the answer, say so.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}"
    )
    answer = _chat_completion(prompt)

    return {"answer": answer, "sources": list(set(sources))}
