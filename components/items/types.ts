// Shared types for the Items/Collection page

export interface Product {
  _id: string;
  title: string;
  slug?: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  price: number;
  images?: string[];
  stockQuantity?: number;
  createdAt: string;
  updatedAt?: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-az"
  | "name-za";

export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
  showFilters: boolean;
}
