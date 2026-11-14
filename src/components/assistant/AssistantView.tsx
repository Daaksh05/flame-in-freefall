"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  ExternalLink,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  FileText,
  BookmarkCheck,
  AlertCircle,
  HelpCircle,
  Flame,
  X,
} from "lucide-react";
import {
  ChatMessagePayload,
  Citation,
  ChatRequest,
} from "@/types";
import { queryAssistant } from "@/services/assistantService";
import { getMaterialsList } from "@/services/experimentService";

const RESEARCH_QUESTIONS = [
  "Does flow velocity affect flame spread in microgravity?",
  "How does oxygen concentration affect flammability of cotton-fiberglass fabric?",
  "Does compartment width or confinement affect how dangerous a fire is in microgravity?",
  "What happens to PMMA flames when ventilation flow is reduced?",
];

export function AssistantView() {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([
    {
      role: "assistant",
      content:
        "Welcome to the **Flame in Freefall** AI Research Assistant. I answer questions using retrieval-augmented generation grounded only in the NASA technical reports indexed for this project (BASS, BASS-II, FLEX, and Confined Combustion). If the reports don't cover something, I'll say so rather than guess.\n\nAsk me about **flame spread**, **ventilation effects**, or **extinction conditions** for the materials in this dataset.",
      // No timestamp here: formatting it with the viewer's locale during SSR
      // produces a different string server-side vs. client-side (hydration
      // mismatch). Set once after mount instead.
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [materialFilter, setMaterialFilter] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>("conv-01");
  const [materialsList, setMaterialsList] = useState<string[]>([]);

  useEffect(() => {
    getMaterialsList().then(setMaterialsList).catch(() => {});
    setMessages((prev) =>
      prev.map((m, i) =>
        i === 0 && !m.timestamp
          ? { ...m, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : m
      )
    );
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryOverride?: string) => {
    const text = (queryOverride || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessagePayload = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload: ChatRequest = {
        message: text,
        conversation_id: conversationId,
        context_filters: materialFilter ? { material: materialFilter } : undefined,
      };

      const res = await queryAssistant(payload);
      if (res.conversation_id) setConversationId(res.conversation_id);

      const assistantMsg: ChatMessagePayload = {
        role: "assistant",
        content: res.message,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (res.citations && res.citations.length > 0) {
        setActiveCitation(res.citations[0]);
      }
    } catch (error) {
      const errMsg: ChatMessagePayload = {
        role: "assistant",
        content: `Couldn't reach the backend: ${error instanceof Error ? error.message : "unknown error"}. Make sure the FastAPI server is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8.5rem)] max-w-7xl mx-auto">
      {/* Main Chat Panel (8 Columns) */}
      <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#111726]/90 border border-slate-800 overflow-hidden shadow-2xl relative">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0b101e]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <span>NASA Combustion RAG Engine</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  NTRS Grounded
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Retrieval-augmented combustion intelligence with primary source verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Bias Knowledge:
            </span>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="bg-[#0b101e] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">All NASA Materials</option>
              {materialsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message History Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4.5 text-xs leading-relaxed space-y-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-lg shadow-orange-950/40"
                    : "bg-[#0b101e] border border-slate-800 text-slate-200 rounded-tl-none shadow-md"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Inline Citations List */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                      Cited NASA Technical Documents:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setActiveCitation(cite)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700/80 transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-cyan-400" />
                          <span className="truncate max-w-[170px]">{cite.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  )}
                  <span
                    className={`ml-auto ${
                      msg.role === "user" ? "text-orange-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0b101e] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-slate-300">
                  Retrieving NASA Technical Reports & synthesizing combustion kinetics...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Research Prompts Bar */}
        {messages.length <= 2 && (
          <div className="p-3 bg-[#0b101e]/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap uppercase">
              Quick Research Queries:
            </span>
            {RESEARCH_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Fixed Bottom Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0b101e]/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Query microgravity flame propagation, LOI thresholds, or report citations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#111726] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Citation Inspector (4 Columns) */}
      <div className="lg:col-span-4 flex flex-col rounded-2xl bg-[#111726]/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-[#0b101e]/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Citation Inspector</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            NTRS Verified
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeCitation ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">
                  Reference Document
                </span>
                <h3 className="text-xs font-bold text-white font-sans leading-snug">
                  {activeCitation.title}
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800 space-y-2 text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Publication:</span>
                  <span className="text-white truncate max-w-[180px]">
                    {activeCitation.publication}
                  </span>
                </div>
                {activeCitation.doi_or_ntrs_id && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Document ID:</span>
                    <span className="text-orange-400 font-bold truncate max-w-[180px]">
                      {activeCitation.doi_or_ntrs_id}
                    </span>
                  </div>
                )}
              </div>

              {activeCitation.snippet && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Evidence Snippet
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#0b101e] border border-slate-800/80 text-slate-300 font-sans italic text-xs leading-relaxed">
                    "{activeCitation.snippet}"
                  </div>
                </div>
              )}

              {activeCitation.source_url && (
                <a
                  href={activeCitation.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium transition-colors"
                >
                  <span>Open NASA NTRS Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <FileText className="w-8 h-8 opacity-40 text-slate-400" />
              <p className="text-xs font-mono text-slate-300">No Citation Selected</p>
              <p className="text-[11px] text-slate-400 max-w-[200px]">
                Click on any citation pill in the assistant's responses to inspect original report snippets and NTRS links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
