"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  className?: string;
}

/**
 * Compact Micro-Pagination Component.
 * Embedded inside the catalog toolbar for rapid desktop page jumping without
 * cluttering mobile views or competing with filters.
 */
export function ToolbarPagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
  className,
}: ToolbarPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      aria-label="Toolbar pagination navigation"
      className={cn(
        "hidden lg:flex items-center gap-1.5 h-10 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none",
        className
      )}
    >
      <span className="tabular-nums select-none">
        <strong className="text-slate-900 font-semibold">{currentPage}</strong>
        <span className="text-slate-300 mx-1">/</span>
        <span className="text-slate-500">{totalPages}</span>
      </span>

      <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 pl-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isPending || currentPage <= 1}
          aria-label="Previous page"
          title="Previous page"
          className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isPending || currentPage >= totalPages}
          aria-label="Next page"
          title="Next page"
          className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
