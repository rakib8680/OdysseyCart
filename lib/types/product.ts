// Shared product type used across all components.
// This is the shape of a product after it's been serialized
// from Mongoose (via JSON.parse(JSON.stringify())).

// ==========================================
// SERIALIZED VARIANT TYPES (Client-Safe)
// ==========================================
export interface VariantOption {
  name: string; // e.g. "Color", "Size"
  values: string[]; // e.g. ["Midnight Black", "Silver"]
}

export interface Variant {
  sku: string; // Unique identifier e.g. "TSHIRT-BLK-M"
  title: string; // Display label e.g. "Black / Medium"
  options: Record<string, string>; // { Color: "Black", Size: "Medium" }
  price?: number; // Override price (falls back to base product price)
  stockQuantity: number; // Per-variant inventory counter
  imageIndex?: number; // Maps variant to product.images[] index
}

// ==========================================
// PRODUCT INTERFACE
// ==========================================
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
  ratingDistribution: Record<string, number>;
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
  options: VariantOption[];
  variants: Variant[];
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

// Server response shape for paginated product queries
export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
