"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Variant } from "@/lib/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StarRating } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { ProductStatusBadges } from "@/components/items/ProductStatusBadges";
import VariantPicker from "@/components/product-details/VariantPicker";
import { ExternalLink, X } from "lucide-react";
import { getProductImages } from "@/lib/utils/productImages";
import { useImageFallback, handleImageError } from "@/hooks/useImageFallback";

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  wishlistIds?: string[];
}

/**
 * Reusable Product Quick View Modal Dialog Component.
 * - Fixed height for all products to prevent layout jumping
 * - Inset image framing with proper padding
 * - Internal scrollable middle section for variant choices
 * - Pinned bottom action bar so Add to Cart is always immediately accessible
 */
export function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
  wishlistIds = [],
}: ProductQuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { imgRef: mainImgRef, onError: onMainImageError } = useImageFallback();

  // Reset local state when active product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedVariant(null);
  }, [product]);

  // Sync image preview when selected variant changes
  const handleVariantChange = (variant: Variant | null) => {
    setSelectedVariant(variant);
    if (
      variant?.imageIndex !== undefined &&
      product?.images?.[variant.imageIndex]
    ) {
      setSelectedImageIndex(variant.imageIndex);
    }
  };

  if (!product) return null;

  const images = getProductImages(product.images);
  const activeImage = images[selectedImageIndex] || images[0];

  const hasVariants =
    product.options &&
    product.options.length > 0 &&
    product.variants &&
    product.variants.length > 0;

  const hasDiscount = product.discount > 0;
  const basePrice = selectedVariant?.price ?? product.price;
  const discountedPrice = hasDiscount
    ? basePrice * (1 - product.discount / 100)
    : basePrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[94vw] max-w-sm sm:max-w-xl md:max-w-4xl p-0 overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-2xl focus:outline-none"
      >
        {/* Global Modal Close Button: Top-Right corner of the Modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Fixed Height Modal Container for predictable, jump-free sizing */}
        <div className="flex flex-col md:grid md:grid-cols-2 h-140 max-h-[85vh] md:h-135">
          {/* 1. Left Image Gallery Panel matching Image 2 */}
          <div className="relative bg-white p-4 sm:p-5 md:p-6 pb-2 sm:pb-4 flex flex-col justify-center items-center shrink-0">
            {/* Main Rounded Image Card */}
            <div className="relative w-full aspect-16/11 sm:aspect-4/3 md:h-72 rounded-xl overflow-hidden bg-slate-50 border p-2  border-slate-100 flex items-center justify-center shadow-2xs">
              {/* Status Badges: Top-Left corner of the image */}
              <div className="absolute top-2.5 left-2.5 z-10 scale-90 sm:scale-100 origin-top-left">
                <ProductStatusBadges product={product} />
              </div>

              <img
                ref={mainImgRef}
                src={activeImage}
                alt={product.title}
                onError={onMainImageError}
                className="w-full h-full object-cover  transition-all duration-300 rounded-xl"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-2 mt-3 max-w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white border-2 overflow-hidden shrink-0 transition-all cursor-pointer shadow-2xs ${
                      selectedImageIndex === idx
                        ? "border-slate-900 ring-2 ring-slate-900/10"
                        : "border-slate-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Right Info & Action Column */}
          <div className="flex flex-col justify-between flex-1 min-h-0 overflow-hidden bg-white">
            {/* Scrollable Middle Content: allows variant options to grow smoothly without resizing the modal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-3 md:space-y-4">
              <DialogHeader className="space-y-1 sm:space-y-1.5 text-left pr-8">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] sm:text-xs font-semibold"
                  >
                    {product.category}
                  </Badge>
                  {product.brand && (
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                      {product.brand}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 leading-snug">
                  {product.title}
                </DialogTitle>

                {/* Pricing Section: Directly below the Title */}
                <div className="pt-1 pb-0.5 flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        ${basePrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                        Save ${(basePrice - discountedPrice).toFixed(2)} (
                        {product.discount}% OFF)
                      </span>
                    </>
                  )}
                </div>

                {product.numReviews > 0 && (
                  <div className="pt-0.5">
                    <StarRating
                      rating={product.averageRating || 0}
                      size="xs"
                      showCount
                      count={product.numReviews}
                    />
                  </div>
                )}

                {/* Description visible on tablet/desktop */}
                {product.shortDescription && (
                  <DialogDescription className="hidden sm:block text-xs sm:text-sm text-slate-500 line-clamp-2 pt-0.5 leading-relaxed">
                    {product.shortDescription}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Inline Compact Variant Picker */}
              {hasVariants && (
                <div className="py-1">
                  <VariantPicker
                    options={product.options!}
                    variants={product.variants!}
                    basePrice={product.price}
                    images={product.images}
                    onVariantChange={handleVariantChange}
                    compact
                  />
                </div>
              )}
            </div>

            {/* Pinned Action Footer: Always visible and accessible with symmetrical buttons */}
            <div className="p-3.5 sm:p-4 space-y-2 sm:space-y-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <AddToCartButton
                    product={product}
                    selectedVariant={selectedVariant}
                    className="w-full h-9 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="h-11 w-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center shrink-0 hover:bg-slate-50 transition-colors shadow-2xs">
                  <HeartButton
                    productId={product._id}
                    initialWishlisted={wishlistIds.includes(product._id)}
                  />
                </div>
              </div>

              <Link
                href={`/items/${product.slug}`}
                onClick={onClose}
                className="w-full h-8.5 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg sm:rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
