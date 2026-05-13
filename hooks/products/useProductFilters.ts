import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product, SortOption } from "@/lib/types/product";

/**
 * Custom hook that encapsulates all product filtering and sorting logic.
 */
export function useProductFilters(products: Product[]) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  // ---------- State ----------
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory || "All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Sync category with URL search param
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  // ---------- Derived ----------

  // Build categories dynamically from real data
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  // Count active filters (excluding defaults)
  const activeFilterCount = [
    search !== "",
    category !== "All",
    minPrice !== "",
    maxPrice !== "",
    sortBy !== "newest",
  ].filter(Boolean).length;

  // ---------- Memoized filter + sort ----------
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = product.price >= min && product.price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

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

  // ---------- Actions ----------
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // ---------- Public API ----------
  return {
    // State
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    showFilters,

    // Setters
    setSearch,
    setCategory,
    setMinPrice,
    setMaxPrice,
    setSortBy,

    // Derived
    categories,
    activeFilterCount,
    filteredProducts,

    // Actions
    resetFilters,
    toggleFilters,
  };
}
