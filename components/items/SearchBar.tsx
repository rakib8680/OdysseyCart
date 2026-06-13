"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const debouncedLocalSearch = useDebounce(localSearch, 300);

  // Sync local state when external search changes (e.g. reset filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Update parent when debounced value changes
  useEffect(() => {
    if (debouncedLocalSearch !== search) {
      onSearchChange(debouncedLocalSearch);
    }
  }, [debouncedLocalSearch, search, onSearchChange]);

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
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className={cn(
          "h-10 px-4 gap-2",
          showFilters || activeFilterCount > 0
            ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            : "text-slate-700",
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-emerald-600 text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>
    </div>
  );
}
