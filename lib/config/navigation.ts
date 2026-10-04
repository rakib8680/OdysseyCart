import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/config/products";

export type MegaMenuKey = "categories" | "items";

export interface NavLink {
  name: string;
  href: string;
  hasMegaMenu: boolean;
  menuKey?: MegaMenuKey;
  exact?: boolean;
}

export interface CuratedCollection {
  id: string;
  name: string;
  description: string;
  href: string;
  badge?: string | null;
  badgeVariant?: "emerald" | "amber" | "slate";
}

export interface QuickShopFilter {
  id: string;
  label: string;
  href: string;
  badge?: string | null;
}

export interface FeaturedSpotlight {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export interface ProductOfTheWeek {
  eyebrow: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  ctaText: string;
  ctaHref: string;
}

/**
 * Primary navigation links for OdysseyCart header.
 * Centralized Single Source of Truth (SSOT).
 */
export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/", hasMegaMenu: false, exact: true },
  {
    name: "Categories",
    href: "/categories",
    hasMegaMenu: true,
    menuKey: "categories",
  },
  {
    name: "Items",
    href: "/items",
    hasMegaMenu: true,
    menuKey: "items",
  },
  { name: "About", href: "/about", hasMegaMenu: false },
  { name: "Contact", href: "/contact", hasMegaMenu: false },
];

/**
 * Curated shopping collections featured in the "Items" Mega Menu.
 */
export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh seasonal drops & latest architectural releases",
    href: "/items?sort=newest",
    badge: "New",
    badgeVariant: "emerald",
  },
  {
    id: "best-sellers",
    name: "Best Sellers",
    description: "Most coveted pieces chosen by our community",
    href: "/items?sort=price-high",
    badge: "Hot",
    badgeVariant: "amber",
  },
  {
    id: "staff-picks",
    name: "Staff Picks",
    description: "Editor-tested gear for daily ergonomics & aesthetics",
    href: "/items",
    badge: "Curated",
    badgeVariant: "slate",
  },
  {
    id: "in-stock",
    name: "In Stock Only",
    description: "Ready to ship immediately within 24 hours",
    href: "/items",
  },
];

/**
 * Quick price and deal filters featured in the "Items" Mega Menu.
 */
export const QUICK_SHOP_FILTERS: QuickShopFilter[] = [
  {
    id: "sale",
    label: "On Sale & Special Offers",
    href: "/items",
    badge: "Sale",
  },
  {
    id: "under-50",
    label: "Under $50 — Everyday Essentials",
    href: "/items?maxPrice=50",
  },
  {
    id: "under-100",
    label: "Under $100 — Accessible Design",
    href: "/items?maxPrice=100",
  },
  {
    id: "luxury-tier",
    label: "Luxury Tier ($200+) — Flagship Gear",
    href: "/items?minPrice=200",
    badge: "Studio",
  },
];

/**
 * Curated spotlight feature inside the "Categories" Mega Menu.
 */
export const CATEGORIES_SPOTLIGHT: FeaturedSpotlight = {
  eyebrow: "SEASON HIGHLIGHT",
  title: "The Minimalist Workspace",
  subtitle:
    "Engineered for deep focus. Handcrafted solid walnut, matte alloy, and acoustic warmth.",
  image:
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  ctaText: "Explore Workspace Drops →",
  ctaHref: "/items?category=Furniture",
};

/**
 * Featured product showcase card inside the "Items" Mega Menu.
 */
export const PRODUCT_OF_THE_WEEK: ProductOfTheWeek = {
  eyebrow: "PRODUCT OF THE WEEK",
  title: "Aero Minimalist Desk",
  category: "Furniture",
  price: 649,
  image:
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
  badge: "Staff Favorite",
  ctaText: "View Product →",
  ctaHref: "/items?category=Furniture",
};

/**
 * Re-export department categories so mega menu components can import from navigation SSOT.
 */
export { PRODUCT_CATEGORIES };
export type { ProductCategory };
