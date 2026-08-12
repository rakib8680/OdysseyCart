import { SortOption } from "@/lib/types/product";

export interface SortConfig {
  value: SortOption;
  label: string;
}

export interface PricePreset {
  label: string;
  min: string;
  max: string;
}

/**
 * Shared product sorting configuration.
 * Used by client filter UI & toolbar.
 */
export const SORT_CONFIG: SortConfig[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "name-az", label: "Name: A → Z" },
  { value: "name-za", label: "Name: Z → A" },
];

/**
 * Shared quick price range filter presets.
 * Used by client filter components.
 */
export const PRICE_PRESETS: PricePreset[] = [
  { label: "Under $50", min: "", max: "50" },
  { label: "$50 – $100", min: "50", max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200+", min: "200", max: "" },
];

/**
 * MongoDB sorting mappings for each SortOption.
 */
export const DB_SORT_MAP: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "price-low": { price: 1 },
  "price-high": { price: -1 },
  "name-az": { title: 1 },
  "name-za": { title: -1 },
};
