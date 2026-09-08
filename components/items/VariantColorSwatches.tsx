"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Product, Variant } from "@/lib/types/product";
import { extractVariantColorSwatches, ColorSwatchItem } from "@/lib/utils/variantHelpers";
import { cn } from "@/lib/utils";

interface VariantColorSwatchesProps {
  product: Product;
  onColorHover?: (imageUrl: string | null) => void;
  onColorClick?: (variant: Variant) => void;
  className?: string;
}

/**
 * Reusable Variant Color Swatches Component.
 * Displays interactive color swatches on product cards with live image preview callbacks on hover,
 * WCAG-computed optical contrast borders, and optional 1-click deep-link navigation.
 */
export function VariantColorSwatches({
  product,
  onColorHover,
  onColorClick,
  className,
}: VariantColorSwatchesProps) {
  const router = useRouter();
  const [activeColor, setActiveColor] = useState<string | null>(null);

  // Memoize swatch calculation to prevent array re-allocation on renders
  const swatches: ColorSwatchItem[] = useMemo(
    () => extractVariantColorSwatches(product),
    [product]
  );

  if (swatches.length === 0) return null;

  const handleMouseEnter = (swatch: ColorSwatchItem) => {
    setActiveColor(swatch.name);
    if (onColorHover && swatch.imageIndex !== undefined && product.images?.[swatch.imageIndex]) {
      onColorHover(product.images[swatch.imageIndex]);
    }
  };

  const handleMouseLeave = () => {
    setActiveColor(null);
    if (onColorHover) {
      onColorHover(null);
    }
  };

  const handleClick = (e: React.MouseEvent, swatch: ColorSwatchItem) => {
    e.stopPropagation();
    if (onColorClick) {
      onColorClick(swatch.variant);
    } else if (swatch.variant?.sku) {
      router.push(`/items/${product.slug}?variant=${encodeURIComponent(swatch.variant.sku)}`);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
      onMouseLeave={handleMouseLeave}
    >
      {swatches.slice(0, 5).map((swatch) => {
        const isActive = activeColor === swatch.name;
        const bg = swatch.swatch?.background || swatch.hex;
        const needsBorder = swatch.swatch?.needsBorder ?? false;

        return (
          <button
            key={swatch.name}
            type="button"
            title={swatch.name}
            aria-label={`Select color ${swatch.name}`}
            onClick={(e) => handleClick(e, swatch)}
            onMouseEnter={() => handleMouseEnter(swatch)}
            className={cn(
              "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 focus:outline-none cursor-pointer shrink-0",
              needsBorder
                ? "ring-1 ring-slate-300/90 inset border border-black/10"
                : "border border-black/10",
              isActive
                ? "ring-2 ring-emerald-600 scale-115 shadow-xs"
                : "hover:scale-110"
            )}
            style={{ background: bg }}
          />
        );
      })}

      {swatches.length > 5 && (
        <span className="text-[10px] text-slate-400 font-medium">
          +{swatches.length - 5}
        </span>
      )}
    </div>
  );
}
