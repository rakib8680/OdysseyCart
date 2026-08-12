"use client";

import ProductCard from "@/components/ProductCard";
import { ProductListItemCard } from "@/components/items/ProductListItemCard";
import { Product, ViewMode } from "@/lib/types/product";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  wishlistIds?: string[];
  viewMode?: ViewMode;
}

/**
 * Product Catalog Renderer Component.
 * Dynamically switches between 3-Column Responsive Grid View and Side-by-Side List View.
 */
export function ProductGrid({
  products,
  wishlistIds = [],
  viewMode = "grid",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 text-slate-500 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
          <PackageSearch className="w-6 h-6" />
        </div>
        <p className="text-base font-bold text-slate-800 mb-1">
          No matching products found
        </p>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          Try adjusting your price range, search query, or category filters.
        </p>
        <Link
          href="/items"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear All Filters
        </Link>
      </div>
    );
  }

  // 1. LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItemCard
            key={product._id}
            product={product}
            wishlistIds={wishlistIds}
          />
        ))}
      </div>
    );
  }

  // 2. GRID VIEW LAYOUT (Default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          wishlistIds={wishlistIds}
        />
      ))}
    </div>
  );
}
