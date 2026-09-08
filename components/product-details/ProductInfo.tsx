"use client";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Product, Variant } from "@/lib/types/product";
import { StarRating } from "@/components/reviews/StarRating";

interface ProductInfoProps {
  product: Product;
  selectedVariant?: Variant | null;
}

export default function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const hasDiscount = product.discount > 0;
  const basePrice = selectedVariant?.price ?? product.price;
  const discountedPrice = hasDiscount
    ? basePrice * (1 - product.discount / 100)
    : basePrice;
  const resolvedStock = selectedVariant?.stockQuantity ?? product.stockQuantity;

  return (
    <>
      {/* Brand, Category & Live Stock Urgency */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-wider text-xs font-bold"
        >
          {product.category}
        </Badge>
        {product.brand && (
          <span className="text-sm font-medium text-slate-500">
            by{" "}
            <span className="text-slate-700 font-semibold">
              {product.brand}
            </span>
          </span>
        )}

        {/* Live Stock Urgency Badge */}
        {resolvedStock > 5 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 ml-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            In Stock
          </span>
        ) : resolvedStock > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 ml-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Only {resolvedStock} Left
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 ml-auto">
            <span className="inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
            Out of Stock
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
        {product.title}
      </h1>

      {/* Ratings — clickable to scroll to review section */}
      <a
        href="#reviews"
        className="flex items-center gap-3 mb-4 group/rating w-fit"
      >
        <StarRating rating={product.averageRating || 0} size="sm" />
        <span className="text-sm font-medium text-slate-600 group-hover/rating:text-emerald-600 transition-colors">
          {product.averageRating?.toFixed(1) || "0.0"} (
          {product.numReviews || 0} reviews)
        </span>
      </a>

      {/* Price & Installment Financing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xl text-slate-400 line-through font-medium">
              ${basePrice.toFixed(2)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
              Save ${(basePrice - discountedPrice).toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
          <span>💳</span>
          <span>
            Or 4 interest-free payments of{" "}
            <strong className="text-slate-700 font-semibold">
              ${(discountedPrice / 4).toFixed(2)}
            </strong>{" "}
            with Stripe
          </span>
        </p>
      </div>

      {/* Description */}
      <div className="prose prose-slate text-slate-600 mb-8 leading-relaxed">
        <p>{product.fullDescription}</p>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {product.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
