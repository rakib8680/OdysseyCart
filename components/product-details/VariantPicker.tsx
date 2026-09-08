"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Variant, VariantOption } from "@/lib/types/product";
import ColorSwatchOption from "./variant-picker/ColorSwatchOption";
import SizeChipOption from "./variant-picker/SizeChipOption";
import PillOption from "./variant-picker/PillOption";

// ==========================================
// TYPES
// ==========================================
interface VariantPickerProps {
  options: VariantOption[];
  variants: Variant[];
  basePrice: number;
  images?: string[];
  initialVariant?: Variant | null;
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
// VARIANT PICKER COMPONENT (Orchestrator)
// ==========================================
export default function VariantPicker({
  options,
  variants,
  basePrice,
  images = [],
  initialVariant = null,
  onVariantChange,
  compact = false,
}: VariantPickerProps) {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    return initialVariant?.options ? { ...initialVariant.options } : {};
  });

  // Pre-computed O(1) lookup map: "Color:Black|Size:M" → Variant
  const variantMap = useMemo(() => {
    const map = new Map<string, Variant>();
    variants.forEach((v) => {
      const key = buildLookupKey(Object.fromEntries(Object.entries(v.options)));
      map.set(key, v);
    });
    return map;
  }, [variants]);

  // Synchronize selections if initialVariant changes (e.g. via deep-link or quick-view product switch)
  useEffect(() => {
    if (initialVariant?.options) {
      setSelections({ ...initialVariant.options });
    }
  }, [initialVariant]);

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
      let updated = { ...selections, [optionName]: value };

      // Verify if updated selection forms a valid in-stock variant
      let lookupKey = buildLookupKey(updated);
      let variant = variantMap.get(lookupKey) || null;

      // Smart Reconciliation: If combination is missing or out of stock,
      // auto-resolve to the first in-stock variant candidate with this selected option
      if (!variant || variant.stockQuantity <= 0) {
        const inStockCandidate = variants.find(
          (v) => v.options[optionName] === value && v.stockQuantity > 0,
        );
        if (inStockCandidate) {
          updated = { ...inStockCandidate.options };
          variant = inStockCandidate;
        } else {
          const candidate = variants.find(
            (v) => v.options[optionName] === value,
          );
          if (candidate) {
            updated = { ...candidate.options };
            variant = candidate;
          }
        }
      }

      setSelections(updated);
      onVariantChange(variant);
    },
    [selections, variantMap, variants, onVariantChange],
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

              {isSize && !compact && (
                <span className="text-xs text-slate-400 font-medium select-none">
                  Standard sizing
                </span>
              )}
            </div>

            {/* Specialized Modular Option Visualizers */}
            {isColor ? (
              <ColorSwatchOption
                option={option}
                variants={variants}
                images={images}
                selectedValue={selectedValue}
                onSelect={(value) => handleSelect(option.name, value)}
                isValueAvailable={isValueAvailable}
                compact={compact}
              />
            ) : isSize ? (
              <SizeChipOption
                option={option}
                selectedValue={selectedValue}
                onSelect={(value) => handleSelect(option.name, value)}
                isValueAvailable={isValueAvailable}
                compact={compact}
              />
            ) : (
              <PillOption
                option={option}
                selectedValue={selectedValue}
                onSelect={(value) => handleSelect(option.name, value)}
                isValueAvailable={isValueAvailable}
                compact={compact}
              />
            )}
          </div>
        );
      })}

      {/* Dynamic Variant Price Indicator */}
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
