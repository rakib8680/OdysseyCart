"use client";

import { useRelativeTime } from "@/hooks/useRelativeTime";
import { RefreshCw } from "lucide-react";

// ==========================================
// LAST UPDATED INDICATOR
// ==========================================

interface LastUpdatedProps {
  /** Epoch timestamp (ms) of the last successful data fetch */
  timestamp: number;
  /** Callback to trigger a manual re-fetch */
  onRefresh: () => void;
  /** Whether a fetch is currently in progress */
  loading: boolean;
}

/**
 * Subtle "Updated X ago" indicator with a clickable refresh icon.
 * Designed for admin dashboard headers to communicate data freshness
 * without cluttering the UI. The relative time ticks live via useRelativeTime.
 */
export function LastUpdated({ timestamp, onRefresh, loading }: LastUpdatedProps) {
  const relativeTime = useRelativeTime(timestamp);

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <span>Updated {relativeTime}</span>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Refresh data"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}
