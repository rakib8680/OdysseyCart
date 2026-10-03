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
 * Includes deterministic unique tie-breakers (_id) to guarantee cursor stability.
 */
export const DB_SORT_MAP: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  "price-low": { price: 1, _id: 1 },
  "price-high": { price: -1, _id: -1 },
  "name-az": { title: 1, _id: 1 },
  "name-za": { title: -1, _id: -1 },
};

import { STORAGE_KEYS } from "@/lib/constants/storage";

/**
 * LocalStorage key for persisting catalog layout view mode preference.
 * Sourced from centralized STORAGE_KEYS SSOT.
 */
export const CATALOG_VIEW_MODE_STORAGE_KEY = STORAGE_KEYS.CATALOG_VIEW_MODE;

// ==========================================
// PRODUCT CATEGORIES
// ==========================================

export interface ProductCategory {
  id: string;
  name: string;
  label: string;
  description: string;
  href: string;
  bgColor: string;
  iconColor: string;
}

export interface CategoryShowcaseItem extends ProductCategory {
  itemCount: number;
  featuredImage: string | null;
}

export interface CategoryDirectoryItem extends CategoryShowcaseItem {
  minPrice: number | null;
}

/**
 * Curated high-resolution lifestyle fallback photography per department.
 * Centralized SSOT for CategoryShowcase, CategoryDirectory, and image fallback pipeline.
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  furniture: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80",
  audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80",
  tech: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80",
  living: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80",
  carry: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80",
  footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
};

/**
 * Single Source of Truth (SSOT) for Product Categories across OdysseyCart.
 * Consumed by admin creation forms, landing page curated collections, all-categories directory, and footer navigation.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "furniture",
    name: "Furniture",
    label: "Modern Furniture",
    description: "Minimalist desks, ergonomic seating, and architectural workspace stands.",
    href: "/items?category=Furniture",
    bgColor: "bg-amber-50/50",
    iconColor: "text-amber-500",
  },
  {
    id: "audio",
    name: "Audio",
    label: "Precision Audio",
    description: "Studio-grade ANC headphones, spatial wireless earbuds, and acoustic desk speakers.",
    href: "/items?category=Audio",
    bgColor: "bg-indigo-50/50",
    iconColor: "text-indigo-500",
  },
  {
    id: "tech",
    name: "Tech",
    label: "Workspace Tech",
    description: "Custom mechanical keyboards, high-speed docking hubs, and smart tech gear.",
    href: "/items?category=Tech",
    bgColor: "bg-blue-50/50",
    iconColor: "text-blue-500",
  },
  {
    id: "living",
    name: "Living",
    label: "Lighting & Living",
    description: "Ambient temperature-adjustable lamps, ceramic drinkware, and desktop organizers.",
    href: "/items?category=Living",
    bgColor: "bg-orange-50/50",
    iconColor: "text-orange-500",
  },
  {
    id: "carry",
    name: "Carry",
    label: "Bags & Travel",
    description: "Weatherproof commuter packs, alpine trail backpacks, and RFID travel organizers.",
    href: "/items?category=Carry",
    bgColor: "bg-teal-50/50",
    iconColor: "text-teal-500",
  },
  {
    id: "footwear",
    name: "Footwear",
    label: "Contemporary Footwear",
    description: "Handcrafted full-grain leather sneakers and engineered daily footwear.",
    href: "/items?category=Footwear",
    bgColor: "bg-rose-50/50",
    iconColor: "text-rose-500",
  },
];

