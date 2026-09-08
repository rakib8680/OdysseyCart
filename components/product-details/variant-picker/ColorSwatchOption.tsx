"use client";

import { Variant, VariantOption } from "@/lib/types/product";
import { resolveColorSwatch } from "@/lib/utils/colors";

interface ColorSwatchOptionProps {
  option: VariantOption;
  variants: Variant[];
  images?: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  isValueAvailable: (optionName: string, value: string) => boolean;
  compact?: boolean;
}

export default function ColorSwatchOption({
  option,
  variants,
  images = [],
  selectedValue,
  onSelect,
  isValueAvailable,
  compact = false,
}: ColorSwatchOptionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {option.values.map((value) => {
        const isSelected = selectedValue === value;
        const isAvailable = isValueAvailable(option.name, value);

        // Check if any variant for this color has a dedicated image in product.images
        const variantForColor = variants.find(
          (v) =>
            v.options[option.name] === value &&
            typeof v.imageIndex === "number" &&
            images[v.imageIndex],
        );

        const thumbnailSrc =
          variantForColor && typeof variantForColor.imageIndex === "number"
            ? images[variantForColor.imageIndex]
            : null;

        // TIER A: Nike-Style Variant Micro-Thumbnail
        if (thumbnailSrc) {
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              disabled={!isAvailable}
              aria-label={`Select color ${value}`}
              title={`${value}${!isAvailable ? " (Out of stock)" : ""}`}
              className={`
                relative shrink-0 overflow-hidden border transition-all cursor-pointer
                ${
                  compact
                    ? "w-9 h-9 rounded-lg"
                    : "w-11 h-11 sm:w-12 sm:h-12 rounded-xl"
                }
                ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 shadow-xs"
                    : isAvailable
                      ? "border-slate-200 hover:border-slate-400 hover:ring-2 hover:ring-slate-200 ring-offset-1"
                      : "border-slate-200/60 opacity-40 cursor-not-allowed"
                }
              `}
            >
              <img
                src={thumbnailSrc}
                alt={value}
                className="w-full h-full object-cover"
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="w-full border-b border-slate-500 -rotate-45" />
                </div>
              )}
            </button>
          );
        }

        // TIER B: Apple-Style Concentric Swatch with WCAG Relative Luminance
        const swatch = resolveColorSwatch(value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            disabled={!isAvailable}
            aria-label={`Select color ${value}`}
            title={`${value}${!isAvailable ? " (Out of stock)" : ""}`}
            className={`
              relative shrink-0 rounded-full transition-all cursor-pointer p-0.5
              ${
                compact
                  ? "w-7 h-7 sm:w-8 sm:h-8"
                  : "w-9 h-9 sm:w-10 sm:h-10"
              }
              ${
                isSelected
                  ? "ring-2 ring-emerald-600 ring-offset-2 scale-105 shadow-xs"
                  : isAvailable
                    ? "hover:scale-105 hover:ring-2 hover:ring-slate-300 ring-offset-1"
                    : "opacity-35 cursor-not-allowed"
              }
            `}
          >
            {/* Physical color swatch disc */}
            <span
              className={`
                block w-full h-full rounded-full transition-transform
                ${swatch.needsBorder ? "ring-1 ring-slate-300/80 inset" : ""}
              `}
              style={{ background: swatch.background }}
            />

            {/* Out of stock strike-through */}
            {!isAvailable && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-4/5 border-b border-slate-600 -rotate-45" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
