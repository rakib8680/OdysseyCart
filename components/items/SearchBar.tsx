"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export function SearchBar({
  search,
  onSearchChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}: SearchBarProps) {
  // Local state for debouncing — prevents server request on every keystroke
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local state when external search changes (e.g. reset filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce: update URL 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="flex gap-3 w-full md:w-auto">
      {/* Search Input */}
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full pl-9 h-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
          showFilters || activeFilterCount > 0
            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
            : "border-input bg-background text-slate-700 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-emerald-600 text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
