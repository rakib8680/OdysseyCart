"use client";

import ProductCard from "@/components/ProductCard";
import { ProductQuickViewModal } from "@/components/items/ProductQuickViewModal";
import { useQuickView } from "@/hooks/useQuickView";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { Product } from "@/lib/types/product";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  items: Product[];
}

export default function RelatedProducts({ items }: RelatedProductsProps) {
  const wishlistIds = useWishlistIds();
  const { activeProduct, isOpen, openQuickView, closeQuickView } =
    useQuickView();

  if (items.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-slate-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Curated Recommendations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            You Might Also Like
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Handpicked items related to this product
        </p>
      </div>

      {/* Product Grid — 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {items.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            wishlistIds={wishlistIds}
            onQuickView={openQuickView}
          />
        ))}
      </div>

      {/* Central Quick View Modal Overlay */}
      <ProductQuickViewModal
        product={activeProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
        wishlistIds={wishlistIds}
      />
    </section>
  );
}

