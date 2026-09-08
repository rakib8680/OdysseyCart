"use client";

import { VariantOption } from "@/lib/types/product";

interface PillOptionProps {
  option: VariantOption;
  selectedValue?: string;
  onSelect: (value: string) => void;
  isValueAvailable: (optionName: string, value: string) => boolean;
  compact?: boolean;
}

export default function PillOption({
  option,
  selectedValue,
  onSelect,
  isValueAvailable,
  compact = false,
}: PillOptionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {option.values.map((value) => {
        const isSelected = selectedValue === value;
        const isAvailable = isValueAvailable(option.name, value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
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
  );
}
