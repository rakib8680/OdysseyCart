"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft, Sparkles } from "lucide-react";
import { POPULAR_SEARCH_TERMS } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Minimalist full-width Search Overlay Drawer.
 * Features auto-focus input, ⌘K / Esc keyboard shortcuts, popular search chips,
 * and seamless navigation routing to `/items?search=...`.
 */
export function SearchOverlay({
  isOpen,
  onClose,
  className,
}: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when overlay opens, clear query on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Lock body scroll and register Escape dismissal
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Execute search and navigate to /items
  const executeSearch = useCallback(
    (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;
      router.push(`/items?search=${encodeURIComponent(trimmed)}`);
      onClose();
    },
    [router, onClose],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSelectChip = (term: string) => {
    setQuery(term);
    executeSearch(term);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Storefront Search"
      className={cn("fixed inset-0 z-50 flex flex-col justify-start", className)}
    >
      {/* 1. Backdrop Atmospheric Scrim */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Top Search Drawer Panel */}
      <div
        className="relative z-10 w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xl shadow-slate-900/10 animate-in slide-in-from-top-4 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-container pt-5 pb-6">
          {/* Header Bar: Eyebrow + Close Action */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Storefront Search
            </span>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 rounded border border-slate-200/60">
                ESC
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Search Bar */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 shrink-0 mr-3.5" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, departments, materials..."
                className="w-full text-lg sm:text-2xl font-medium text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none focus:ring-0 py-2 sm:py-3 pr-24"
                autoComplete="off"
                spellCheck="false"
              />

              <div className="absolute right-0 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-emerald-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Search</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Popular Search Suggestions */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Popular:</span>
            </div>
            {POPULAR_SEARCH_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectChip(term)}
                className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100/90 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-150 cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
