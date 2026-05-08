"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ItemsContentProps {
  products: any[];
}

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-az"
  | "name-za";

function ItemsFilter({ products }: ItemsContentProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory || "All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Sync category with URL param
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  // Build categories dynamically from real data
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // Count active filters (excluding defaults)
  const activeFilterCount = [
    search !== "",
    category !== "All",
    minPrice !== "",
    maxPrice !== "",
    sortBy !== "newest",
  ].filter(Boolean).length;

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  // Filter + Sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Text search
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(search.toLowerCase());

      // Category
      const matchesCategory =
        category === "All" || product.category === category;

      // Price range
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = product.price >= min && product.price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.title.localeCompare(b.title);
        case "name-za":
          return b.title.localeCompare(a.title);
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [products, search, category, minPrice, maxPrice, sortBy]);

  const selectStyles =
    "h-10 px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer";

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

        {/* Search + Filter Toggle (always visible) */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
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
      </div>

      {/* Expandable Filter Bar */}
      {showFilters && (
        <div className="mb-8 p-5 bg-slate-50/80 border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
            {/* Category */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                className={selectStyles + " w-full sm:w-44"}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full sm:w-28 pl-7 h-10"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Any"
                  min="0"
                  step="0.01"
                  className="w-full sm:w-28 pl-7 h-10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                Sort By
              </label>
              <select
                className={selectStyles + " w-full sm:w-44"}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-az">Name: A → Z</option>
                <option value="name-za">Name: Z → A</option>
              </select>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredProducts.length}
          </span>{" "}
          of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-sm">
            Try adjusting your filters or{" "}
            <button
              onClick={resetFilters}
              className="text-emerald-600 underline cursor-pointer"
            >
              reset all filters
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function ItemsContent({ products }: ItemsContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading collection...
        </div>
      }
    >
      <ItemsFilter products={products} />
    </Suspense>
  );
}
