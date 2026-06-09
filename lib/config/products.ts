import { SortOption } from "@/lib/types/product";

export interface SortConfig {
  value: SortOption;
  label: string;
}

/**
 * Shared product sorting configuration.
 * Used by:
 * - Client: `FilterPanel` to render sort options dynamically
 * - Server: Mapping options to MongoDB sort criteria
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
