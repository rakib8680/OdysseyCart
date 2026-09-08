"use client";

import { useMemo, useState, useCallback } from "react";
import { Variant, VariantOption } from "@/lib/types/product";
import { resolveColorSwatch } from "@/lib/utils/colors";

// ==========================================
// TYPES
// ==========================================
interface VariantPickerProps {
  options: VariantOption[];
  variants: Variant[];
  basePrice: number;
  images?: string[];
  onVariantChange: (variant: Variant | null) => void;
  compact?: boolean;
}

// ==========================================
// HELPERS
// ==========================================

/** Builds a deterministic key from a selections map for O(1) variant lookup */
function buildLookupKey(selections: Record<string, string>): string {
  return Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

function isColorOption(name: string): boolean {
  const n = name.toLowerCase().trim();
  return n === "color" || n === "shade" || n === "style" || n.includes("color");
}

function isSizeOption(name: string): boolean {
  const n = name.toLowerCase().trim();
  return n === "size" || n.includes("size");
}

// ==========================================
// VARIANT PICKER COMPONENT
// ==========================================
export default function VariantPicker({
  options,
  variants,
  basePrice,
  images = [],
  onVariantChange,
  compact = false,
}: VariantPickerProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Pre-computed O(1) lookup map: "Color:Black|Size:M" → Variant
  const variantMap = useMemo(() => {
    const map = new Map<string, Variant>();
    variants.forEach((v) => {
      const key = buildLookupKey(Object.fromEntries(Object.entries(v.options)));
      map.set(key, v);
    });
    return map;
  }, [variants]);

  // Resolve the currently selected variant from the map
  const selectedVariant = useMemo(() => {
    if (Object.keys(selections).length !== options.length) return null;
    return variantMap.get(buildLookupKey(selections)) || null;
  }, [selections, options.length, variantMap]);

  // Check if a specific option value leads to any valid (in-stock) variant
  const isValueAvailable = useCallback(
    (optionName: string, value: string): boolean => {
      return variants.some((v) => {
        if (v.options[optionName] !== value) return false;
        if (v.stockQuantity <= 0) return false;
        // Check compatibility with current selections (excluding this option)
        return Object.entries(selections).every(
          ([key, sel]) => key === optionName || v.options[key] === sel,
        );
      });
    },
    [variants, selections],
  );

  const handleSelect = useCallback(
    (optionName: string, value: string) => {
      const updated = { ...selections, [optionName]: value };
      setSelections(updated);

      if (Object.keys(updated).length === options.length) {
        const variant = variantMap.get(buildLookupKey(updated)) || null;
        onVariantChange(variant);
      } else {
        onVariantChange(null);
      }
    },
    [selections, options.length, variantMap, onVariantChange],
  );

  // Resolved price display
  const displayPrice = selectedVariant?.price ?? basePrice;

  return (
    <div className={compact ? "space-y-3.5 mb-3" : "space-y-5 mb-6"}>
      {/* Option Groups */}
      {options.map((option) => {
        const isColor = isColorOption(option.name);
        const isSize = isSizeOption(option.name);
        const selectedValue = selections[option.name];

        return (
          <div key={option.name} className="space-y-2">
            {/* Option Header Label with Active Value */}
            <div className="flex items-center justify-between">
              <label
                className={
                  compact
                    ? "text-xs font-semibold text-slate-800"
                    : "text-sm font-semibold text-slate-800"
                }
              >
                {option.name}
                {selectedValue && (
                  <span className="text-emerald-700 font-medium ml-1.5 font-sans">
                    — {selectedValue}
                  </span>
                )}
              </label>

              {/* Helpful sizing hint if size option */}
              {isSize && !compact && (
                <span className="text-xs text-slate-400 font-medium select-none">
                  Standard sizing
                </span>
              )}
            </div>

            {/* Option Visualizer Group */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {option.values.map((value) => {
                const isSelected = selectedValue === value;
                const isAvailable = isValueAvailable(option.name, value);

                // ==========================================
                // 1. COLOR OPTION VISUALIZER (Hybrid: Nike / Apple)
                // ==========================================
                if (isColor) {
                  // Check if any variant for this color has a dedicated image in product.images
                  const variantForColor = variants.find(
                    (v) =>
                      v.options[option.name] === value &&
                      typeof v.imageIndex === "number" &&
                      images[v.imageIndex],
                  );

                  const thumbnailSrc =
                    variantForColor &&
                    typeof variantForColor.imageIndex === "number"
                      ? images[variantForColor.imageIndex]
                      : null;

                  // TIER A: Nike-Style Variant Micro-Thumbnail
                  if (thumbnailSrc) {
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelect(option.name, value)}
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
                      onClick={() => handleSelect(option.name, value)}
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
                }

                // ==========================================
                // 2. SIZE OPTION VISUALIZER (Tactile Sizing Chips)
                // ==========================================
                if (isSize) {
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelect(option.name, value)}
                      disabled={!isAvailable}
                      aria-label={`Select size ${value}`}
                      className={`
                        relative flex items-center justify-center border font-semibold transition-all cursor-pointer
                        ${
                          compact
                            ? "min-w-9.5 h-8 px-2.5 rounded-lg text-xs"
                            : "min-w-11.5 h-10 px-3.5 rounded-xl text-sm"
                        }
                        ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 shadow-xs"
                            : isAvailable
                              ? "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700"
                              : "relative border-slate-200/80 bg-slate-50 text-slate-300 cursor-not-allowed opacity-60 overflow-hidden"
                        }
                      `}
                    >
                      <span className={!isAvailable ? "opacity-50" : ""}>
                        {value}
                      </span>
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="w-full border-b border-slate-300 -rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                }

                // ==========================================
                // 3. GENERAL OPTION VISUALIZER (Tactile Pill Chips)
                // ==========================================
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelect(option.name, value)}
                    disabled={!isAvailable}
                    className={`
                      border font-medium transition-all cursor-pointer
                      ${
                        compact
                          ? "px-3 py-1.5 rounded-lg text-xs"
                          : "px-4 py-2 rounded-xl text-sm"
                      }
                      ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 font-semibold shadow-xs"
                          : isAvailable
                            ? "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                            : "border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed opacity-50"
                      }
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Dynamic Variant Price Indicator (Shown when price deviates from base price) */}
      {!compact &&
        selectedVariant?.price &&
        selectedVariant.price !== basePrice && (
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 pt-1 font-medium">
            <span>Price updated for selected variant:</span>
            <span className="font-bold text-slate-900">
              ${displayPrice.toFixed(2)}
            </span>
          </p>
        )}
    </div>
  );
}
