"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { productFilterParsers } from "@/lib/search-params";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { ActiveFilters } from "./ActiveFilters";

interface ItemsFilterProps {
  categories: string[];
}

export function ItemsFilter({ categories }: ItemsFilterProps) {
  const [filters, setFilters] = useQueryStates(productFilterParsers, {
    shallow: false, // Trigger server re-render on URL change
  });

  const [showFilters, setShowFilters] = useState(false);

  // Count non-default filters (excluding page)
  const activeFilterCount = [
    filters.search !== "",
    filters.category !== "",
    filters.minPrice !== "",
    filters.maxPrice !== "",
    filters.sort !== "newest",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Collection
          </h1>
          <p className="text-slate-500">
            Explore our premium selection of gear and accessories.
          </p>
        </div>

        <SearchBar
          search={filters.search}
          onSearchChange={(value) => setFilters({ search: value, page: 1 })}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev) => !prev)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <ActiveFilters
          filters={filters}
          onClear={setFilters}
          onReset={resetFilters}
        />
      )}

      {/* Expandable Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          onFilterChange={(updates) => setFilters({ ...updates, page: 1 })}
          onReset={resetFilters}
        />
      )}
    </>
  );
}
