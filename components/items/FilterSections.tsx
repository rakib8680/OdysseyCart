"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { SORT_CONFIG, PRICE_PRESETS } from "@/lib/config/products";
import { ProductFilters } from "@/lib/types/product";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { Check, RotateCcw, DollarSign, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterSectionsProps {
  filters: ProductFilters;
  categories: string[];
  activeFilterCount: number;
  onFilterChange: (updates: Record<string, string>) => void;
  onReset: () => void;
}

/**
 * Reusable Filter Sections Component.
 * Pure UI component used identically by both DesktopSidebar and MobileFilterDrawer
 * to guarantee strict DRY code principles.
 * Reuses centralized `FormInput`, `FormSelect`, and custom `useDebouncedCallback` hook.
 */
export function FilterSections({
  filters,
  categories,
  activeFilterCount,
  onFilterChange,
  onReset,
}: FilterSectionsProps) {
  // Local state for price range input displays
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  // Sync local inputs when URL search params change externally (presets, active pill clear, reset)
  useEffect(() => {
    setLocalMin(filters.minPrice);
  }, [filters.minPrice]);

  useEffect(() => {
    setLocalMax(filters.maxPrice);
  }, [filters.maxPrice]);

  // Industry-standard debounced callbacks for input typing
  const debouncedMinChange = useDebouncedCallback((val: string) => {
    onFilterChange({ minPrice: val });
  }, 350);

  const debouncedMaxChange = useDebouncedCallback((val: string) => {
    onFilterChange({ maxPrice: val });
  }, 350);

  // Clear pending typing timers when preset or clear links are clicked
  const cancelPendingDebounces = () => {
    debouncedMinChange.cancel();
    debouncedMaxChange.cancel();
  };

  const handleMinInputChange = (val: string) => {
    setLocalMin(val);
    debouncedMinChange(val);
  };

  const handleMaxInputChange = (val: string) => {
    setLocalMax(val);
    debouncedMaxChange(val);
  };

  const handlePricePreset = (min: string, max: string) => {
    cancelPendingDebounces();
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleClearPrice = () => {
    cancelPendingDebounces();
    onFilterChange({ minPrice: "", maxPrice: "" });
  };

  return (
    <div className="space-y-6 text-sm">
      {/* 1. CATEGORY FILTER */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Tag className="w-3.5 h-3.5" />
          <span>Category</span>
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: "" })}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs font-medium",
              filters.category === ""
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
            )}
          >
            <span>All Categories</span>
            {filters.category === "" && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => {
            const isSelected =
              filters.category?.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat.toLowerCase() })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs font-medium",
                  isSelected
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                )}
              >
                <span className="truncate">{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. PRICE RANGE FILTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Price Range</span>
          </div>
          {(filters.minPrice || filters.maxPrice) && (
            <button
              type="button"
              onClick={handleClearPrice}
              className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Custom Min / Max Input using centralized FormInput */}
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Min ($)"
            id="filter-min-price"
            type="number"
            placeholder="0"
            min="0"
            step="1"
            className="h-9 text-xs bg-white"
            value={localMin}
            onChange={(e) => handleMinInputChange(e.target.value)}
          />
          <FormInput
            label="Max ($)"
            id="filter-max-price"
            type="number"
            placeholder="Any"
            min="0"
            step="1"
            className="h-9 text-xs bg-white"
            value={localMax}
            onChange={(e) => handleMaxInputChange(e.target.value)}
          />
        </div>

        {/* Quick Price Presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {PRICE_PRESETS.map((preset) => {
            const isPresetActive =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePricePreset(preset.min, preset.max)}
                className={cn(
                  "px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors text-center border cursor-pointer",
                  isPresetActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                    : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. SORT BY FILTER using centralized FormSelect */}
      <div className="space-y-3">
        <FormSelect
          label="Sort By"
          id="filter-sort-select"
          options={[]}
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="h-9 text-xs"
        >
          {SORT_CONFIG.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </div>

      {/* 4. RESET ALL BUTTON */}
      {activeFilterCount > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              cancelPendingDebounces();
              onReset();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer border border-red-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters ({activeFilterCount})</span>
          </button>
        </div>
      )}
    </div>
  );
}
