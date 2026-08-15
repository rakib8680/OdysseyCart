"use client";

import { useQueryStates } from "nuqs";
import { productFilterParsers } from "@/lib/search-params";
import { useViewMode } from "@/hooks/useViewMode";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { ItemsToolbar } from "./ItemsToolbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { ActiveFilters } from "./ActiveFilters";
import { CategoryChips } from "./CategoryChips";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { Product } from "@/lib/types/product";

interface ItemsFilterProps {
  categories: string[];
  products: Product[];
  totalPages: number;
  currentPage: number;
}

/**
 * Main Items Filter Controller & Layout Component.
 * Orchestrates URL filter state via `nuqs`, layout view mode via `useViewMode`,
 * renders top toolbar, active filter chips, category quick-nav chips, sticky desktop sidebar,
 * and renders the product grid in Grid or List view.
 */
export function ItemsFilter({
  categories,
  products,
  totalPages,
  currentPage,
}: ItemsFilterProps) {
  const [filters, setFilters] = useQueryStates(productFilterParsers, {
    shallow: false, // Trigger server re-render on URL change
  });

  const { viewMode, setViewMode } = useViewMode("grid");
  const wishlistIds = useWishlistIds();

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
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Toolbar (Search Bar + Mobile Drawer Trigger + Quick Sort + View Mode Toggle) */}
      <ItemsToolbar
        search={filters.search}
        sort={filters.sort}
        categories={categories}
        filters={filters}
        activeFilterCount={activeFilterCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearchChange={(value) => handleFilterChange({ search: value })}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* 2. Active Filter Chips */}
      {activeFilterCount > 0 && (
        <ActiveFilters
          filters={filters}
          onClear={handleFilterChange}
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

        {/* Main Product Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Category Quick-Nav Chips Row */}
          <CategoryChips
            categories={categories}
            selectedCategory={filters.category}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
          />

          {/* Product Catalog Renderer (Grid vs. List View) */}
          <ProductGrid
            products={products}
            wishlistIds={wishlistIds}
            viewMode={viewMode}
          />

          {/* Pagination (only when needed) */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
