"use client";

import { ReactNode } from "react";
import { useQueryStates } from "nuqs";
import { productFilterParsers } from "@/lib/search-params";
import { ItemsToolbar } from "./ItemsToolbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { ActiveFilters } from "./ActiveFilters";

interface ItemsFilterProps {
  categories: string[];
  children?: ReactNode;
}

/**
 * Main Items Filter Controller & Layout Component.
 * Orchestrates URL state via `nuqs`, renders the top toolbar, active filter chips,
 * sticky desktop sidebar, and wraps the server-rendered product grid.
 */
export function ItemsFilter({ categories, children }: ItemsFilterProps) {
  const [filters, setFilters] = useQueryStates(productFilterParsers, {
    shallow: false, // Trigger server re-render on URL change
  });

  // Count non-default active filters (excluding page)
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

  const handleFilterChange = (updates: Record<string, string>) => {
    setFilters({ ...updates, page: 1 });
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Toolbar (Search Bar + Mobile Drawer Trigger + Quick Sort) */}
      <ItemsToolbar
        search={filters.search}
        sort={filters.sort}
        categories={categories}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onSearchChange={(value) => handleFilterChange({ search: value })}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* 2. Active Filter Chips */}
      {activeFilterCount > 0 && (
        <ActiveFilters
          filters={filters}
          onClear={setFilters}
          onReset={resetFilters}
        />
      )}

      {/* 3. Main 2-Column Layout (Sticky Desktop Sidebar + Main Product Content) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Desktop Sidebar */}
        <DesktopSidebar
          filters={filters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        {/* Main Product Content Area (Grid + Pagination) */}
        <div className="flex-1 min-w-0 w-full space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
