"use client";

import { useProductFilters } from "./useProductFilters";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid } from "./ProductGrid";
import { Product } from "./types";

interface ItemsFilterProps {
  products: Product[];
}

export function ItemsFilter({ products }: ItemsFilterProps) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    showFilters,
    setSearch,
    setCategory,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    categories,
    activeFilterCount,
    filteredProducts,
    resetFilters,
    toggleFilters,
  } = useProductFilters(products);

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16 min-h-screen">
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
          search={search}
          onSearchChange={setSearch}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Expandable Filter Bar */}
      {showFilters && (
        <FilterPanel
          category={category}
          categories={categories}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortBy={sortBy}
          activeFilterCount={activeFilterCount}
          onCategoryChange={setCategory}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onSortChange={setSortBy}
          onReset={resetFilters}
        />
      )}

      {/* Product Grid + Empty State */}
      <ProductGrid
        products={filteredProducts}
        totalCount={products.length}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
