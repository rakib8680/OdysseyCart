"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/types/product";
import { extractVariantColorSwatches, ColorSwatchItem } from "@/lib/utils/variantHelpers";
import { cn } from "@/lib/utils";

interface VariantColorSwatchesProps {
  product: Product;
  onColorHover?: (imageUrl: string | null) => void;
  className?: string;
}

/**
 * Reusable Variant Color Swatches Component.
 * Displays interactive color dots on product cards with live image preview callbacks on hover.
 */
export function VariantColorSwatches({
  product,
  onColorHover,
  className,
}: VariantColorSwatchesProps) {
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

  return (
    <div
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
      onMouseLeave={handleMouseLeave}
    >
      {swatches.slice(0, 5).map((swatch) => {
        const isActive = activeColor === swatch.name;
        return (
          <button
            key={swatch.name}
            type="button"
            title={`${swatch.name}`}
            aria-label={`Color ${swatch.name}`}
            onMouseEnter={() => handleMouseEnter(swatch)}
            className={cn(
              "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-slate-300 transition-all duration-200 focus:outline-none cursor-pointer",
              isActive ? "ring-2 ring-slate-900 scale-110" : "hover:scale-110"
            )}
            style={{ backgroundColor: swatch.hex }}
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
