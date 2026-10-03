import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { CategoryDirectoryItem } from "@/lib/config/products";
import { CATEGORY_FALLBACK_IMAGES } from "@/lib/config/products";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";
import { formatPrice } from "@/lib/utils/pricing";

interface CategoryDirectoryCardProps {
  category: CategoryDirectoryItem;
}

/**
 * CategoryDirectoryCard Component
 *
 * Implements a full-bleed photographic department card for `/categories`.
 * Features live item counts, starting price badges, hover depth zoom,
 * and high-contrast dark vignette for optimal typography legibility.
 */
export function CategoryDirectoryCard({ category }: CategoryDirectoryCardProps) {
  const displayImage =
    category.featuredImage ||
    CATEGORY_FALLBACK_IMAGES[category.id] ||
    FALLBACK_PRODUCT_IMAGE;

  return (
    <Link
      href={category.href}
      className="group relative aspect-16/10 sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 select-none"
    >
      {/* 1. Background Image with Smooth Hover Zoom */}
      <img
        src={displayImage}
        alt={category.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* 2. Layered Vignette Gradient for High Contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/50 via-50% to-slate-950/25 pointer-events-none" />

      {/* 3. Top Badges & Counters */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Live Item Count Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-semibold border border-white/20 shadow-xs">
          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>
            {category.itemCount} {category.itemCount === 1 ? "Product" : "Products"}
          </span>
        </span>

        {/* Pricing Floor Kicker */}
        {category.minPrice !== null && (
          <span className="inline-flex items-center px-2.5 py-1 bg-slate-950/60 backdrop-blur-md text-slate-200 rounded-full text-[11px] font-medium border border-white/10">
            From {formatPrice(category.minPrice)}
          </span>
        )}
      </div>

      {/* 4. Bottom Content & Action CTA */}
      <div className="relative z-10 space-y-2.5 pt-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
            {category.label}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mt-1">
            {category.description}
          </p>
        </div>

        {/* Action Link Bar */}
        <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
          <span>Explore Department</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
