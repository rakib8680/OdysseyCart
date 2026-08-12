"use client";

import { SearchBar } from "./SearchBar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { FormSelect } from "@/components/form/FormSelect";
import { SORT_CONFIG } from "@/lib/config/products";
import { ProductFilters } from "@/lib/types/product";

interface ItemsToolbarProps {
  search: string;
  sort: string;
  categories: string[];
  filters: ProductFilters;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (updates: Record<string, string>) => void;
  onReset: () => void;
}

/**
 * Top Items Toolbar Component.
 * Orchestrates debounced search bar, mobile filter drawer button, and desktop quick-sort dropdown.
 * Reuses centralized `FormSelect` from components/form and `ProductFilters` from lib/types/product.
 */
export function ItemsToolbar({
  search,
  sort,
  categories,
  filters,
  activeFilterCount,
  onSearchChange,
  onFilterChange,
  onReset,
}: ItemsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      {/* Search Input */}
      <SearchBar
        search={search}
        onSearchChange={onSearchChange}
      />

      {/* Right Controls: Mobile Drawer + Desktop Sort */}
      <div className="flex items-center gap-2 justify-between sm:justify-end">
        {/* Mobile Filter Drawer Button */}
        <MobileFilterDrawer
          filters={filters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          onFilterChange={onFilterChange}
          onReset={onReset}
        />

        {/* Desktop Quick Sort Dropdown using FormSelect */}
        <div className="hidden lg:block w-44">
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
      </div>
    </div>
  );
}
