"use client";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Product } from "@/lib/types/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <>
      {/* Brand & Category */}
      <div className="flex items-center gap-3 mb-4">
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
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold text-slate-900">
          ${discountedPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-xl text-slate-400 line-through">
            ${product.price.toFixed(2)}
          </span>
        )}
        {hasDiscount && (
          <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
            Save ${(product.price - discountedPrice).toFixed(2)}
          </span>
        )}
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
