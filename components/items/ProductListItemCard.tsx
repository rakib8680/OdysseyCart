"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { StarRating } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types/product";

interface ProductListItemCardProps {
  product: Product;
  wishlistIds?: string[];
}

/**
 * Product List Item Card Component.
 * Uniform-height horizontal side-by-side list view card.
 * Designed to maintain consistent height across all items, clean price formatting, and compact mobile action controls.
 */
export function ProductListItemCard({
  product,
  wishlistIds = [],
}: ProductListItemCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="group border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 rounded-xl bg-white overflow-hidden flex flex-row items-stretch h-36 sm:h-52">
      {/* 1. Left Image Container */}
      <div className="relative w-28 sm:w-56 shrink-0 h-full bg-slate-50 border-r border-slate-100 overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10">
            -{product.discount}%
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <HeartButton
            productId={product._id}
            initialWishlisted={wishlistIds.includes(product._id)}
          />
        </div>
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Right Body Container (Mobile: Stacked Details + Full-Width Price/Action Row | Desktop: Split Columns) */}
      <div className="flex-1 min-w-0 p-3 sm:p-5 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Product Info (Title, Category, Rating, Description) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1 sm:space-y-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] sm:text-[11px] px-1.5 py-0"
              >
                {product.category}
              </Badge>
              {isOutOfStock ? (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-100 text-[10px] px-1.5 py-0"
                >
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] px-1.5 py-0"
                >
                  Only {product.stockQuantity} Left
                </Badge>
              ) : null}
            </div>

            <Link
              href={`/items/${product.slug}`}
              className="block group-hover:text-blue-600 transition-colors"
            >
              <h3 className="text-xs sm:text-lg font-bold text-slate-900 truncate">
                {product.title}
              </h3>
            </Link>

            {product.brand && (
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                {product.brand}
              </p>
            )}
          </div>

          {/* Star Rating & Short Description */}
          <div className="space-y-1">
            {product.numReviews > 0 && (
              <StarRating
                rating={product.averageRating || 0}
                size="sm"
                showCount
                count={product.numReviews}
              />
            )}
            <p className="text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 hidden sm:block">
              {product.shortDescription}
            </p>
          </div>
        </div>

        {/* Price & Action Row (Mobile: Bottom row inside right container | Desktop: Separate right column) */}
        <div className="shrink-0 sm:w-48 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-stretch gap-2 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-t-0 sm:border-l sm:pl-5 sm:bg-slate-50/50 sm:-my-5 sm:-mr-5 sm:p-5">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="font-extrabold text-sm sm:text-xl text-slate-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 hidden sm:block">
                Save ${(product.price - discountedPrice).toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:flex-col sm:space-y-2">
            <Link
              href={`/items/${product.slug}`}
              aria-label="View Details"
              title="View Details"
              className="flex h-8 sm:h-9 w-8 sm:w-full bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors rounded-lg items-center justify-center text-xs font-semibold shrink-0"
            >
              <span className="hidden sm:inline">View Details</span>
              <Eye className="w-4 h-4 sm:hidden shrink-0 text-slate-600" />
            </Link>
            <AddToCartButton
              product={product}
              compactText
              className="h-8 sm:h-9 px-2.5 sm:px-3 sm:w-full rounded-lg text-xs font-semibold shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
