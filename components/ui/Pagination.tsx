"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaginationRange, type PaginationItem } from "@/lib/utils/pagination";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  isPending?: boolean;
  className?: string;
  showQuickJump?: boolean;
}

/**
 * Enterprise-grade Adaptive Pagination Component.
 * - Mobile Mode (< 640px): Clean touch-friendly controller (Prev | Page X of Y | Next).
 * - Desktop Mode (≥ 640px): Deterministic 7-slot sliding window (zero layout shift).
 * - 100+ Pages Scalability: Interactive quick-jump popover on ellipsis click.
 * - Fully accessible and dark mode ready.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
  className,
  showQuickJump = true,
}: PaginationProps) {
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  const [jumpOpen, setJumpOpen] = useState<"left" | "right" | null>(null);
  const [jumpValue, setJumpValue] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close jump popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setJumpOpen(null);
      }
    }
    if (jumpOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [jumpOpen]);

  if (totalPages <= 1) return null;

  const safeCurrent = Math.max(1, Math.min(currentPage, totalPages));

  const handlePageSelect = (page: number) => {
    if (isPending) return;
    const targetPage = Math.max(1, Math.min(page, totalPages));
    if (onPageChange) {
      onPageChange(targetPage);
    } else {
      setPage(targetPage);
    }
  };

  const handleQuickJump = () => {
    const parsed = parseInt(jumpValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      handlePageSelect(parsed);
      setJumpOpen(null);
      setJumpValue("");
    }
  };

  const paginationRange = getPaginationRange({
    currentPage: safeCurrent,
    totalPages,
    siblingCount: 1,
  });

  return (
    <nav
      role="navigation"
      aria-label="Pagination navigation"
      className={cn(
        "flex items-center justify-center mt-12 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* ============================================================ */}
      {/* MOBILE VIEW (< 640px): Compact Touch-Friendly Bar            */}
      {/* ============================================================ */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-xs px-2">
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrent - 1)}
          disabled={isPending || safeCurrent <= 1}
          aria-label="Go to previous page"
          className="flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums select-none">
          Page <strong className="text-slate-900 dark:text-white font-bold">{safeCurrent}</strong> of{" "}
          <span className="text-slate-700 dark:text-slate-300">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrent + 1)}
          disabled={isPending || safeCurrent >= totalPages}
          aria-label="Go to next page"
          className="flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP VIEW (≥ 640px): Deterministic 7-Slot Sliding Window  */}
      {/* ============================================================ */}
      <div className="hidden sm:flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrent - 1)}
          disabled={isPending || safeCurrent <= 1}
          aria-label="Previous page"
          className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Numbered & Ellipsis Slots */}
        {paginationRange.map((item: PaginationItem, index: number) => {
          if (typeof item === "number") {
            const isActive = item === safeCurrent;
            return (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => handlePageSelect(item)}
                disabled={isPending}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-semibold tabular-nums transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                  isActive
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {item}
              </button>
            );
          }

          // Ellipsis Item with Interactive Quick-Jump Popover
          const ellipsisSide = item === "ellipsis-left" ? "left" : "right";
          const isPopoverOpen = jumpOpen === ellipsisSide;

          return (
            <div key={`${item}-${index}`} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (showQuickJump) {
                    setJumpOpen(isPopoverOpen ? null : ellipsisSide);
                    setJumpValue("");
                  }
                }}
                disabled={isPending || !showQuickJump}
                aria-label={`Jump to page (${ellipsisSide})`}
                title={showQuickJump ? "Click to jump to a specific page" : undefined}
                className={cn(
                  "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg select-none transition-colors",
                  showQuickJump
                    ? "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    : "text-slate-400 cursor-default"
                )}
              >
                …
              </button>

              {/* Quick-Jump Inline Popover */}
              {isPopoverOpen && (
                <div
                  ref={popoverRef}
                  role="dialog"
                  aria-label="Jump to page"
                  className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1.5 flex items-center gap-1.5"
                >
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder="Page"
                    value={jumpValue}
                    onChange={(e) => setJumpValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleQuickJump();
                      if (e.key === "Escape") setJumpOpen(null);
                    }}
                    autoFocus
                    className="w-16 h-7 text-xs px-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-center focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={handleQuickJump}
                    className="h-7 px-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrent + 1)}
          disabled={isPending || safeCurrent >= totalPages}
          aria-label="Next page"
          className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
