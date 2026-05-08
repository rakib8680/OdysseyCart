import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { SortOption } from "./types";

const SELECT_STYLES =
  "h-10 px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer";

interface FilterPanelProps {
  category: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
  activeFilterCount: number;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
}

export function FilterPanel({
  category,
  categories,
  minPrice,
  maxPrice,
  sortBy,
  activeFilterCount,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="mb-8 p-5 bg-slate-50/80 border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
        {/* Category */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            className={SELECT_STYLES + " w-full sm:w-44"}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              $
            </span>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full sm:w-28 pl-7 h-10"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              $
            </span>
            <Input
              type="number"
              placeholder="Any"
              min="0"
              step="0.01"
              className="w-full sm:w-28 pl-7 h-10"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Sort By
          </label>
          <select
            className={SELECT_STYLES + " w-full sm:w-44"}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name-az">Name: A → Z</option>
            <option value="name-za">Name: Z → A</option>
          </select>
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
