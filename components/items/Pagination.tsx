"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  isPending?: boolean;
}

/**
 * Reusable pagination component that syncs with URL via nuqs or custom handler.
 * Can be used anywhere paginated data is displayed (items, admin tables, orders).
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
}: PaginationProps) {
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );

  const handlePageSelect = (page: number) => {
    if (isPending) return;
    if (onPageChange) {
      onPageChange(page);
    } else {
      setPage(page);
    }
  };

  // Generate visible page numbers (show max 5 centered around current)
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 mt-12 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Previous */}
      <button
        onClick={() => handlePageSelect(currentPage - 1)}
        disabled={isPending || currentPage <= 1}
        className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => handlePageSelect(1)}
            disabled={isPending}
            className="w-10 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="w-10 h-10 flex items-center justify-center text-slate-400">
              …
            </span>
          )}
        </>
      )}

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => handlePageSelect(num)}
          disabled={isPending}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            num === currentPage
              ? "bg-slate-900 text-white shadow-sm"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {num}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="w-10 h-10 flex items-center justify-center text-slate-400">
              …
            </span>
          )}
          <button
            onClick={() => handlePageSelect(totalPages)}
            disabled={isPending}
            className="w-10 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageSelect(currentPage + 1)}
        disabled={isPending || currentPage >= totalPages}
        className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
