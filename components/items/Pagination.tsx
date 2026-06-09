"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Reusable pagination component that syncs with URL via nuqs.
 * Can be used anywhere paginated data is displayed (items, admin tables, orders).
 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );

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
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="w-10 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
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
          onClick={() => setPage(num)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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
            onClick={() => setPage(totalPages)}
            className="w-10 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
