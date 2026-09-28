"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/lib/types/product";
import { getProductImageUrl } from "@/lib/utils/productImages";
import { handleImageError } from "@/hooks/useImageFallback";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils/pricing";
import { Star } from "lucide-react";

interface EditorialCardProps {
  product: Product;
  isLarge?: boolean;
}

export function EditorialCard({ product, isLarge }: EditorialCardProps) {
  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount)
    : product.price;

  return (
    <Link
      href={`/items/${product.slug}`}
      className="group flex flex-col h-full w-full"
    >
      {/* Image Container - Borderless and clean */}
      <div
        className={`relative w-full ${
          isLarge ? "aspect-4/3 md:aspect-video" : "aspect-4/3"
        } bg-slate-100 rounded-2xl overflow-hidden mb-4 sm:mb-6`}
      >
        <img
          src={getProductImageUrl(product.images)}
          alt={product.title}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
          <span className="px-2.5 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-sm">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-2 sm:px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
              -{product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Typography - Minimalist, responsive */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4 mb-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug ${
                isLarge ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {product.title}
            </h3>
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {product.averageRating.toFixed(1)}
                </span>
                <span>({product.numReviews})</span>
              </div>
            )}
          </div>

          <div className="sm:text-right shrink-0 mt-0.5 sm:mt-0">
            {hasDiscount ? (
              <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                <span
                  className={`font-extrabold text-slate-900 ${
                    isLarge ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg"
                  }`}
                >
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span
                className={`font-bold text-slate-900 ${
                  isLarge ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg"
                }`}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {isLarge && (
          <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-2xl mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-2 sm:mt-auto flex items-center text-xs sm:text-sm font-bold text-emerald-600 uppercase tracking-wide">
          <span className="group-hover:text-emerald-700 transition-colors">
            Discover
          </span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
