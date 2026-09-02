"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { StarRating } from "@/components/reviews/StarRating";
import { ProductStatusBadges } from "@/components/items/ProductStatusBadges";
import { Eye } from "lucide-react";
import { Product } from "@/lib/types/product";
import { getProductImageUrl } from "@/lib/utils/productImages";
import { useImageFallback } from "@/hooks/useImageFallback";

interface ProductCardProps {
  product: Product;
  wishlistIds?: string[];
  onQuickView?: (product: Product) => void;
}

/**
 * Grid Product Card Component.
 * Clicking anywhere on the card navigates to the product detail page,
 * while interactive buttons perform their respective isolated actions.
 */
export default function ProductCard({
  product,
  wishlistIds = [],
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const imageUrl = getProductImageUrl(product.images);
  const { imgRef, onError: onImageError } = useImageFallback();

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Navigate to product details unless clicking a button or link
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    router.push(`/items/${product.slug}`, { scroll: true });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group h-full   transition-all duration-300 rounded-xl overflow-hidden flex flex-col bg-white cursor-pointer"
    >
      {/* 1. Product Image Wrapper (Aspect Square) */}
      <div className="w-full aspect-square bg-slate-50 overflow-hidden relative border-b border-slate-100/60">
        {/* Dynamic Status Badges (Scaled down on mobile) */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 scale-75 sm:scale-90 origin-top-left">
          <ProductStatusBadges product={product} />
        </div>

        {/* Floating Wishlist Button */}
        <div
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 scale-80 sm:scale-100 origin-top-right"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartButton
            productId={product._id}
            initialWishlisted={wishlistIds.includes(product._id)}
          />
        </div>

        {/* Product Image */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt={product.title}
          onError={onImageError}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />

        {/* DESKTOP ONLY: Hover Action Overlay on Image */}
        <div
          className="hidden sm:flex absolute bottom-2.5 left-2.5 right-2.5 z-20 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1.5 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            product={product}
            compactText
            className="flex-1 h-9 bg-slate-900 text-white hover:bg-emerald-600 font-semibold text-[11px] uppercase tracking-wider rounded-lg shadow-xs border-0 transition-colors px-2"
          />
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick View"
              aria-label="Quick View Product"
              className="w-9 h-9 shrink-0 rounded-lg bg-white/95 text-slate-800 shadow-xs border border-slate-200/80 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Product Details Section */}
      <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 space-y-1.5 bg-white">
        {/* Brand & Title */}
        <div>
          {product.brand && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mb-0.5 truncate">
              {product.brand}
            </p>
          )}
          <Link
            href={`/items/${product.slug}`}
            className="block transition-colors"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Responsive Ratings */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-extrabold text-xs sm:text-base text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Scaled Review Stars */}
          {product.numReviews > 0 && (
            <>
              <div className="block sm:hidden">
                <StarRating
                  rating={product.averageRating || 0}
                  size="xs"
                  showCount
                  count={product.numReviews}
                />
              </div>
              <div className="hidden sm:block">
                <StarRating
                  rating={product.averageRating || 0}
                  size="sm"
                  showCount
                  count={product.numReviews}
                />
              </div>
            </>
          )}
        </div>

        {/* MOBILE ONLY: Action Buttons at Card Bottom */}
        <div
          className="flex sm:hidden items-center gap-1.5 pt-1.5 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            product={product}
            compactText
            className="flex-1 h-7.5 bg-slate-900 text-white font-semibold text-[10px] uppercase tracking-wider rounded-md border-0 transition-colors px-1"
          />
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick View"
              aria-label="Quick View Product"
              className="w-7.5 h-7.5 shrink-0 rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
