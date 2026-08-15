"use client";

import { useMemo, useState, useCallback } from "react";
import { Package, AlertTriangle } from "lucide-react";
import { Variant, VariantOption } from "@/lib/types/product";

// ==========================================
// TYPES
// ==========================================
interface VariantPickerProps {
  options: VariantOption[];
  variants: Variant[];
  basePrice: number;
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

// ==========================================
// VARIANT PICKER COMPONENT
// ==========================================
export default function VariantPicker({
  options,
  variants,
  basePrice,
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
    // Only resolve when ALL options have been selected
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

      // Notify parent when all options are selected
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
    <div className={compact ? "space-y-3 mb-3" : "space-y-5 mb-6"}>
      {/* Option Groups */}
      {options.map((option) => (
        <div key={option.name}>
          <label
            className={
              compact
                ? "text-xs font-semibold text-slate-700 mb-1.5 block"
                : "text-sm font-semibold text-slate-700 mb-2.5 block"
            }
          >
            {option.name}
            {selections[option.name] && (
              <span className="text-emerald-600 font-medium ml-1.5">
                — {selections[option.name]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {option.values.map((value) => {
              const isSelected = selections[option.name] === value;
              const isAvailable = isValueAvailable(option.name, value);

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(option.name, value)}
                  disabled={!isAvailable}
                  className={`
                    ${
                      compact
                        ? "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                        : "px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer"
                    }
                    ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20"
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
      ))}

      {/* Dynamic Stock Indicator */}
      {selectedVariant && (
        <StockIndicator
          stockQuantity={selectedVariant.stockQuantity}
          compact={compact}
        />
      )}

      {/* Price update indicator (shown on full product page) */}
      {!compact &&
        selectedVariant?.price &&
        selectedVariant.price !== basePrice && (
          <p className="text-sm text-slate-500">
            Price updated for selected variant:{" "}
            <span className="font-semibold text-slate-900">
              ${displayPrice.toFixed(2)}
            </span>
          </p>
        )}
    </div>
  );
}

// ==========================================
// STOCK INDICATOR (DRY Sub-Component)
// ==========================================
function StockIndicator({
  stockQuantity,
  compact = false,
}: {
  stockQuantity: number;
  compact?: boolean;
}) {
  const badgeClasses = compact
    ? "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md w-fit"
    : "flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg w-fit";

  const iconClasses = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  if (stockQuantity <= 0) {
    return (
      <div className={`${badgeClasses} text-red-600 bg-red-50`}>
        <AlertTriangle className={iconClasses} />
        Out of Stock
      </div>
    );
  }

  if (stockQuantity <= 5) {
    return (
      <div className={`${badgeClasses} text-amber-600 bg-amber-50`}>
        <AlertTriangle className={iconClasses} />
        Only {stockQuantity} left in stock
      </div>
    );
  }

  return (
    <div className={`${badgeClasses} text-emerald-600 bg-emerald-50`}>
      <Package className={iconClasses} />
      In Stock — Ready to ship
    </div>
  );
}
