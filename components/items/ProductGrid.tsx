"use client";

import ProductCard from "@/components/ProductCard";
import { ProductListItemCard } from "@/components/items/ProductListItemCard";
import { ProductQuickViewModal } from "@/components/items/ProductQuickViewModal";
import { useQuickView } from "@/hooks/useQuickView";
import { Product, ViewMode } from "@/lib/types/product";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  wishlistIds?: string[];
  viewMode?: ViewMode;
  isPending?: boolean;
}

/**
 * Product Catalog Renderer Component.
 * Dynamically switches between Grid and List views with staggered Framer Motion entrance animations,
 * integrates the central Quick View Modal overlay, and displays a non-disruptive loading overlay during transitions.
 */
export function ProductGrid({
  products,
  wishlistIds = [],
  viewMode = "grid",
  isPending = false,
}: ProductGridProps) {
  const { activeProduct, isOpen, openQuickView, closeQuickView } = useQuickView();

  if (products.length === 0) {
    return (
      <div className="relative min-h-75 flex flex-col justify-center">
        <div
          className={cn(
            "text-center py-20 px-4 text-slate-500 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center transition-opacity duration-200",
            isPending && "opacity-40 pointer-events-none"
          )}
        >
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
        <LoadingOverlay isLoading={isPending} message="Searching products..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-90">
      <div
        className={cn(
          "transition-opacity duration-200 ease-in-out",
          isPending && "opacity-40 pointer-events-none"
        )}
      >
        <AnimatePresence mode="wait">
          {/* 1. LIST VIEW LAYOUT */}
          {viewMode === "list" ? (
            <motion.div
              key="catalog-list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <ProductListItemCard
                    product={product}
                    wishlistIds={wishlistIds}
                    onQuickView={openQuickView}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* 2. GRID VIEW LAYOUT */
            <motion.div
              key="catalog-grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <ProductCard
                    product={product}
                    wishlistIds={wishlistIds}
                    onQuickView={openQuickView}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isPending} message="Updating products..." />

      {/* 3. CENTRAL QUICK VIEW MODAL OVERLAY */}
      <ProductQuickViewModal
        product={activeProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
        wishlistIds={wishlistIds}
      />
    </div>
  );
}
