"use client";

import { useState } from "react";
import { askQuestion } from "@/lib/api";

export default function ChatPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const result = await askQuestion(question);
      setAnswer(result.answer);
      setSources(result.sources);
    } catch {
      setAnswer("Something went wrong reaching the assistant. Is the backend running?");
      setSources([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Ask the research assistant</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Grounded in FLEX/BASS report text. e.g. &quot;How does flame spread rate change as oxygen concentration increases?&quot;
      </p>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask a question about the combustion research..."
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
      {answer && (
        <div className="mt-4 rounded border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-800">
          <p className="text-zinc-800 dark:text-zinc-100">{answer}</p>
          {sources.length > 0 && (
            <p className="mt-2 text-xs text-zinc-500">Sources: {sources.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
