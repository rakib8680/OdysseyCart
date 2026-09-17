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

/**
 * Single Source of Truth (SSOT) for Product Categories across OdysseyCart.
 * Consumed by admin creation forms, landing page curated collections, and footer navigation.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "tech",
    name: "Tech",
    label: "Tech Essentials",
    description: "Premium gadgets and gear to elevate your productivity.",
    href: "/items?category=Tech",
    bgColor: "bg-blue-50/50",
    iconColor: "text-blue-500",
  },
  {
    id: "furniture",
    name: "Furniture",
    label: "Modern Furniture",
    description: "Minimalist pieces designed for comfort and aesthetics.",
    href: "/items?category=Furniture",
    bgColor: "bg-orange-50/50",
    iconColor: "text-orange-500",
  },
  {
    id: "accessories",
    name: "Accessories",
    label: "Daily Accessories",
    description: "Sleek add-ons to complete your everyday carry.",
    href: "/items?category=Accessories",
    bgColor: "bg-emerald-50/50",
    iconColor: "text-emerald-500",
  },
];

