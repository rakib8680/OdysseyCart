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
import { ExternalLink } from "lucide-react";
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
 * Responsive sizing: Compact, scroll-free layout on mobile devices; full layout on desktop.
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
      <DialogContent className="w-[90vw] max-w-md sm:max-w-3xl p-0 overflow-hidden bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto overflow-x-hidden">
          {/* 1. Left Image Gallery (Compact on Mobile) */}
          <div className="relative bg-slate-50 p-3 sm:p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden">
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10   origin-top-left">
              <ProductStatusBadges product={product} />
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10   origin-top-right">
              <HeartButton
                productId={product._id}
                initialWishlisted={wishlistIds.includes(product._id)}
              />
            </div>

            {/* Compact Aspect Image Container */}
            <div className="w-full aspect-4/3 sm:aspect-square max-h-48 sm:max-h-none relative flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl bg-white p-2 border border-slate-200/60 shadow-2xs my-auto">
              <img
                ref={mainImgRef}
                src={activeImage}
                alt={product.title}
                onError={onMainImageError}
                className="w-full h-full object-cover rounded-md sm:rounded-lg mix-blend-multiply transition-all duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4 max-w-full py-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-md sm:rounded-lg border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-slate-900 ring-2 ring-slate-900/20"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Right Product Info & Actions */}
          <div className="p-4 sm:p-6 flex flex-col justify-between space-y-3 sm:space-y-4">
            <DialogHeader className="space-y-1.5 sm:space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] sm:text-xs"
                >
                  {product.category}
                </Badge>
                {product.brand && (
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    {product.brand}
                  </span>
                )}
              </div>

              <DialogTitle className="text-base sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.title}
              </DialogTitle>

              {product.numReviews > 0 && (
                <div className="pt-0.5">
                  <StarRating
                    rating={product.averageRating || 0}
                    size="sm"
                    showCount
                    count={product.numReviews}
                  />
                </div>
              )}

              <DialogDescription className="text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-3 pt-0.5">
                {product.shortDescription}
              </DialogDescription>
            </DialogHeader>

            {/* Pricing Section */}
            <div className="space-y-0.5 py-1.5 sm:py-2 border-y border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-2xl font-extrabold text-slate-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                  Save ${(basePrice - discountedPrice).toFixed(2)} (
                  {product.discount}% OFF)
                </p>
              )}
            </div>

            {/* Inline Variant Picker */}
            {hasVariants && (
              <div className="py-1.5 sm:py-2 border-b border-slate-100">
                <VariantPicker
                  options={product.options!}
                  variants={product.variants!}
                  basePrice={product.price}
                  onVariantChange={handleVariantChange}
                />
              </div>
            )}

            {/* Action Footer */}
            <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
              <AddToCartButton
                product={product}
                selectedVariant={selectedVariant}
                className="w-full h-9 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-sm"
              />

              <Link
                href={`/items/${product.slug}`}
                onClick={onClose}
                className="w-full h-8.5 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg sm:rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
