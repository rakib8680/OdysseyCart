"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/**
 * Category Quick-Nav Chips Component.
 * Renders a horizontal scrollable pill row for instant one-tap category filtering.
 */
export function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-1 mb-4 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* All Categories Chip */}
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border",
            selectedCategory === ""
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          <Sparkles className="w-3 h-3" />
          <span>All Items</span>
        </button>

        {/* Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border whitespace-nowrap",
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs font-semibold"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
