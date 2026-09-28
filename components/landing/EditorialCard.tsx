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
        } bg-slate-100 rounded-2xl overflow-hidden mb-6`}
      >
        <img
          src={getProductImageUrl(product.images)}
          alt={product.title}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-sm">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
              -{product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Typography - Minimalist, no borders */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div>
            <h3
              className={`font-bold text-slate-900 group-hover:text-emerald-700 transition-colors ${
                isLarge ? "text-2xl md:text-3xl" : "text-xl"
              }`}
            >
              {product.title}
            </h3>
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-800">
                  {product.averageRating.toFixed(1)}
                </span>
                <span>({product.numReviews})</span>
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            {hasDiscount ? (
              <div className="flex flex-col items-end">
                <span
                  className={`font-bold text-slate-900 ${
                    isLarge ? "text-xl md:text-2xl" : "text-lg"
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
                className={`font-medium text-slate-500 ${
                  isLarge ? "text-xl" : "text-lg"
                }`}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {isLarge && (
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mb-6 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center text-sm font-bold text-emerald-600 uppercase tracking-wide">
          <span className="group-hover:text-emerald-700 transition-colors">
            Discover
          </span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
