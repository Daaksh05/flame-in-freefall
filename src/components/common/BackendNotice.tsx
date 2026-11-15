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
    <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF4EC] p-5 text-slate-700">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#EA580C] flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-900 text-sm">
              Waiting for FastAPI Endpoint Response
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white text-[#EA580C] border border-[#FED7AA]">
              {endpoint}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            This view is configured to fetch live microgravity combustion data from{" "}
            <code className="text-slate-800 bg-white px-1 py-0.5 rounded font-mono border border-slate-200">
              {API_BASE_URL}{endpoint}
            </code>
            . Once your FastAPI backend server is started, data will automatically stream into this view.
          </p>
          {error && (
            <p className="text-xs font-mono text-red-700 bg-red-50 p-2 rounded border border-red-200">
              Diagnostic: {error}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white hover:bg-[#FFE8D1] text-[#EA580C] border border-[#FED7AA] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            )}
            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#EA580C] hover:underline font-mono"
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
