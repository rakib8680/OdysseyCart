import { Input } from "@/components/ui/input";
import { SORT_CONFIG } from "@/lib/config/products";
import { X } from "lucide-react";

const SELECT_STYLES =
  "h-10 px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer";

interface FilterPanelProps {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
  categories: string[];
  activeFilterCount: number;
  onFilterChange: (updates: Record<string, string>) => void;
  onReset: () => void;
}

export function FilterPanel({
  filters,
  categories,
  activeFilterCount,
  onFilterChange,
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
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="">All</option>
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
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
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
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        {/* Sort By — rendered dynamically from shared config */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Sort By
          </label>
          <select
            className={SELECT_STYLES + " w-full sm:w-44"}
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
          >
            {SORT_CONFIG.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
