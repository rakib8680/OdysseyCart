// Shared product type used across all components.
// This is the shape of a product after it's been serialized
// from Mongoose (via JSON.parse(JSON.stringify())).
export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  images: string[];
  stockQuantity: number;
  averageRating: number;
  numReviews: number;
  createdBy: string;
  brand: string;
  tags: string[];
  specs: Record<string, string>;
  discount: number;
  isFeatured: boolean;
  warranty: string;
  shippingInfo: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Shared types for the Items page
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
