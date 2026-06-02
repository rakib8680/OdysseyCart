"use client";

import { cn } from "@/lib/utils";
import type { AnalyticsPeriod } from "@/lib/types/analytics";

interface PeriodOption {
  value: AnalyticsPeriod;
  label: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "12m", label: "12M" },
];

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
}

/**
 * Reusable segmented toggle for selecting analytics time periods.
 * Owns zero state — controlled component (value + onChange from parent).
 * Can be reused in any time-filtered view (orders, user activity, etc).
 */
export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === option.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
