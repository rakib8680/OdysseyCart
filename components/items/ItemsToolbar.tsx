"use client";

import { SearchBar } from "./SearchBar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { ItemsViewToggle } from "./ItemsViewToggle";
import { ToolbarPagination } from "./ToolbarPagination";
import { FormSelect } from "@/components/form/FormSelect";
import { SORT_CONFIG } from "@/lib/config/products";
import { ProductFilters, ViewMode } from "@/lib/types/product";

interface ItemsToolbarProps {
  search: string;
  sort: string;
  categories: string[];
  filters: ProductFilters;
  activeFilterCount: number;
  viewMode: ViewMode;
  isPending?: boolean;
  currentPage?: number;
  totalPages?: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (updates: Record<string, string>) => void;
  onReset: () => void;
  onPageChange?: (page: number) => void;
}

/**
 * Top Items Toolbar Component.
 * Orchestrates debounced search bar, mobile filter drawer button, quick-sort dropdown,
 * view mode layout switcher (Grid vs. List), and compact desktop micro-pagination.
 */
export function ItemsToolbar({
  search,
  sort,
  categories,
  filters,
  activeFilterCount,
  viewMode,
  isPending = false,
  currentPage,
  totalPages,
  onViewModeChange,
  onSearchChange,
  onFilterChange,
  onReset,
  onPageChange,
}: ItemsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Search Input */}
      <SearchBar
        search={search}
        onSearchChange={onSearchChange}
        isSearching={isPending}
      />

      {/* Right Controls: Mobile Drawer + Desktop Sort + View Toggle + Top Micro-Pager */}
      <div className="flex items-center gap-2 justify-between sm:justify-end">
        {/* Mobile Filter Drawer Button */}
        <MobileFilterDrawer
          filters={filters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          onFilterChange={onFilterChange}
          onReset={onReset}
        />

        {/* Quick Sort Dropdown using FormSelect */}
        <div className="w-40 sm:w-44">
          <FormSelect
            label=""
            id="desktop-sort-select"
            aria-label="Sort catalog"
            options={[]}
            value={sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="h-10 text-xs font-medium"
          >
            {SORT_CONFIG.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* View Mode Toggle (Grid vs. List) */}
        <ItemsViewToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        {/* Desktop Micro-Pagination */}
        {totalPages !== undefined &&
          totalPages > 1 &&
          currentPage !== undefined &&
          onPageChange && (
            <ToolbarPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isPending={isPending}
            />
          )}
      </div>
    </div>
  );
}
