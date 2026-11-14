"use client";

import React from "react";
import { Server, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface BackendNoticeProps {
  endpoint: string;
  onRetry?: () => void;
  error?: string;
}

export function BackendNotice({ endpoint, onRetry, error }: BackendNoticeProps) {
  return (
    <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-5 text-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-amber-300 text-sm">
              Waiting for FastAPI Endpoint Response
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-400 border border-amber-800/60">
              {endpoint}
            </span>
          </div>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            This view is configured to fetch live microgravity combustion data from{" "}
            <code className="text-amber-200 bg-amber-950/60 px-1 py-0.5 rounded font-mono">
              {API_BASE_URL}{endpoint}
            </code>
            . Once your FastAPI backend server is started, data will automatically stream into this view.
          </p>
          {error && (
            <p className="text-xs font-mono text-rose-300/90 bg-rose-950/40 p-2 rounded border border-rose-900/40">
              Diagnostic: {error}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            )}
            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 underline font-mono"
            >
              <Server className="w-3 h-3" />
              Check FastAPI docs ({API_BASE_URL}/docs)
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
