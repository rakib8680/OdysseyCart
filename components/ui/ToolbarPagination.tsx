"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToolbarPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  className?: string;
}

/**
 * Compact Micro-Pagination Component.
 * Pure presenter for rapid page jumping in toolbars, headers, and control rows.
 * Features tabular figures, accessible chevrons, and smooth disabled/pending states.
 */
export function ToolbarPagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
  className,
}: ToolbarPaginationProps) {
  if (totalPages <= 1) return null;

  const safeCurrent = Math.max(1, Math.min(currentPage, totalPages));

  return (
    <div
      role="navigation"
      aria-label="Micro pagination navigation"
      className={cn(
        "flex items-center gap-1.5 h-10 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 transition-opacity duration-200 shadow-xs",
        isPending && "opacity-50 pointer-events-none",
        className
      )}
    >
      <span className="tabular-nums select-none">
        <strong className="text-slate-900 dark:text-white font-semibold">{safeCurrent}</strong>
        <span className="text-slate-300 dark:text-slate-600 mx-1">/</span>
        <span className="text-slate-500 dark:text-slate-400">{totalPages}</span>
      </span>

      <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 dark:border-slate-800 pl-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, safeCurrent - 1))}
          disabled={isPending || safeCurrent <= 1}
          aria-label="Previous page"
          title="Previous page"
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, safeCurrent + 1))}
          disabled={isPending || safeCurrent >= totalPages}
          aria-label="Next page"
          title="Next page"
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
