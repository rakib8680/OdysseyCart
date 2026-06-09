"use client";

import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
  onClear: (updates: Record<string, string | number>) => void;
  onReset: () => void;
}

/**
 * Displays active filter chips with individual clear buttons.
 * Provides quick visual feedback of what's currently filtered.
 */
export function ActiveFilters({ filters, onClear, onReset }: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.search) {
    chips.push({
      label: `Search: "${filters.search}"`,
      onRemove: () => onClear({ search: "", page: 1 }),
    });
  }

  if (filters.category) {
    chips.push({
      label: `Category: ${filters.category}`,
      onRemove: () => onClear({ category: "", page: 1 }),
    });
  }

  if (filters.minPrice) {
    chips.push({
      label: `Min: $${filters.minPrice}`,
      onRemove: () => onClear({ minPrice: "", page: 1 }),
    });
  }

  if (filters.maxPrice) {
    chips.push({
      label: `Max: $${filters.maxPrice}`,
      onRemove: () => onClear({ maxPrice: "", page: 1 }),
    });
  }

  if (filters.sort && filters.sort !== "newest") {
    chips.push({
      label: `Sort: ${filters.sort}`,
      onRemove: () => onClear({ sort: "newest", page: 1 }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-700 border border-slate-200"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="hover:bg-slate-200 rounded-full p-0.5 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {chips.length > 1 && (
        <button
          onClick={onReset}
          className="text-sm text-red-600 hover:text-red-700 font-medium ml-1 cursor-pointer"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
