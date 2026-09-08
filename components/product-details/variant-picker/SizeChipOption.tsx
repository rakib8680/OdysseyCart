"use client";

import { VariantOption } from "@/lib/types/product";

interface SizeChipOptionProps {
  option: VariantOption;
  selectedValue?: string;
  onSelect: (value: string) => void;
  isValueAvailable: (optionName: string, value: string) => boolean;
  compact?: boolean;
}

export default function SizeChipOption({
  option,
  selectedValue,
  onSelect,
  isValueAvailable,
  compact = false,
}: SizeChipOptionProps) {
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
            <span className={!isAvailable ? "opacity-50" : ""}>{value}</span>
            {!isAvailable && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-full border-b border-slate-300 -rotate-45" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
