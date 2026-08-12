"use client";

import { FilterSections, FilterSectionsProps } from "./FilterSections";
import { SlidersHorizontal } from "lucide-react";

export type DesktopSidebarProps = FilterSectionsProps;

/**
 * Sticky Desktop Sidebar Filters.
 * Visible on desktop viewports (`hidden lg:block`), providing continuous,
 * always-accessible product filtering without obstructing the product grid.
 */
export function DesktopSidebar({
  filters,
  categories,
  activeFilterCount,
  onFilterChange,
  onReset,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-6 pr-6 border-r border-slate-100">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Filters
          </h2>
        </div>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
            {activeFilterCount} active
          </span>
        )}
      </div>

      {/* Shared Filter Controls */}
      <FilterSections
        filters={filters}
        categories={categories}
        activeFilterCount={activeFilterCount}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
    </aside>
  );
}
