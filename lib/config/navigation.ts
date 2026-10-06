import {
  PRODUCT_CATEGORIES,
  ProductCategory,
  CATEGORY_FALLBACK_IMAGES,
} from "@/lib/config/products";

export type MegaMenuKey = "categories" | "items";

export interface NavLink {
  name: string;
  href: string;
  hasMegaMenu: boolean;
  menuKey?: MegaMenuKey;
  exact?: boolean;
}

// ==========================================
// EDITORIAL MEGA MENU CONFIGURATION (SSOT)
// ==========================================

export type NavBadgeVariant = "emerald" | "amber" | "slate" | "rose";
export type MerchBadgeVariant = "emerald" | "amber" | "dark";

/**
 * Single Source of Truth for navigation link badge styling tokens.
 * Shared across desktop MegaMenuColumn and MobileNavOverlay for 100% visual parity.
 */
export const NAV_BADGE_STYLES: Record<NavBadgeVariant, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  amber: "bg-amber-50 text-amber-700 border-amber-200/60",
  rose: "bg-rose-50 text-rose-700 border-rose-200/60",
  slate: "bg-slate-100 text-slate-700 border-slate-200/60",
};

/**
 * Single Source of Truth for visual merchandising card overlay badge tokens.
 */
export const MERCH_BADGE_STYLES: Record<MerchBadgeVariant, string> = {
  emerald: "bg-emerald-600 text-white",
  amber: "bg-amber-500 text-white",
  dark: "bg-slate-900/90 text-white",
};

export interface MegaMenuLinkItem {
  id: string;
  name: string;
  href: string;
  badge?: string | null;
  badgeVariant?: NavBadgeVariant;
  isMuted?: boolean;
}

export interface MegaMenuColumnConfig {
  kicker: string;
  countLabel?: string;
  items: MegaMenuLinkItem[];
  footerLink?: {
    label: string;
    href: string;
  };
}

export interface MegaMenuMerchandiseItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge: string;
  badgeVariant?: MerchBadgeVariant;
  href: string;
}

export interface MegaMenuActionPill {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  icon?: "arrow" | "sparkles" | "grid";
}

export interface MegaMenuConfig {
  columns: MegaMenuColumnConfig[];
  merchandise: MegaMenuMerchandiseItem[];
  actions: MegaMenuActionPill[];
}

export interface CuratedCollection extends MegaMenuLinkItem {
  description: string;
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
 * Curated shopping collections.
 * Consumed by MobileNavOverlay drawer and directly reused in ITEMS_MEGA_MENU_CONFIG.
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
 * Quick price and deal filters.
 * Reused directly as MegaMenuLinkItem[] in ITEMS_MEGA_MENU_CONFIG.
 */
export const QUICK_SHOP_FILTERS: MegaMenuLinkItem[] = [
  {
    id: "filter-sale",
    name: "On Sale & Special Offers",
    href: "/items",
    badge: "Sale",
    badgeVariant: "rose",
  },
  {
    id: "filter-under-50",
    name: "Under $50 — Everyday Essentials",
    href: "/items?maxPrice=50",
  },
  {
    id: "filter-under-100",
    name: "Under $100 — Accessible Design",
    href: "/items?maxPrice=100",
  },
  {
    id: "filter-luxury-tier",
    name: "Luxury Tier ($200+) — Flagship Gear",
    href: "/items?minPrice=200",
    badge: "Studio",
    badgeVariant: "slate",
  },
];

// Helper dictionary & transformation mapper to derive department links from PRODUCT_CATEGORIES SSOT
const CATEGORY_MAP = Object.fromEntries(
  PRODUCT_CATEGORIES.map((cat) => [cat.id, cat])
) as Record<string, ProductCategory>;

const toDepartmentLink = (catId: string): MegaMenuLinkItem => {
  const cat = CATEGORY_MAP[catId];
  return {
    id: `cat-${cat.id}`,
    name: cat.label || cat.name,
    href: cat.href,
  };
};

/**
 * Editorial Mega Menu Configuration for "Categories".
 * High-speed 3-column link stack + 2-card visual merchandising showcase.
 * Departments and photography are strictly derived from SSOT.
 */
export const CATEGORIES_MEGA_MENU_CONFIG: MegaMenuConfig = {
  columns: [
    {
      kicker: "Curated Intent",
      items: [
        { id: "cat-all", name: "Shop All Products", href: "/items" },
        { id: "cat-bestsellers", name: "Best Sellers", href: "/items?sort=price-high", badge: "Hot", badgeVariant: "amber" },
        { id: "cat-new", name: "New Arrivals", href: "/items?sort=newest", badge: "New", badgeVariant: "emerald" },
        { id: "cat-deals", name: "Special Offers & Deals", href: "/items", badge: "Sale", badgeVariant: "rose" },
      ],
    },
    {
      kicker: "Home & Workspace",
      items: ["furniture", "tech", "living"].map(toDepartmentLink),
    },
    {
      kicker: "Lifestyle & Wear",
      items: ["audio", "carry", "footwear"].map(toDepartmentLink),
      footerLink: {
        label: "View All 6 Departments Directory →",
        href: "/categories",
      },
    },
  ],
  merchandise: [
    {
      id: "merch-aero-desk",
      title: "Aero Minimalist Desk",
      subtitle: "Solid walnut workspace engineered for daily focus",
      category: "Furniture",
      price: 649,
      compareAtPrice: 749,
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
      badge: "BESTSELLER",
      badgeVariant: "dark",
      href: "/items?category=Furniture",
    },
    {
      id: "merch-apex-headphones",
      title: "Apex Pro Studio ANC",
      subtitle: "Acoustic precision with memory-foam ear cushions",
      category: "Audio",
      price: 299,
      image: CATEGORY_FALLBACK_IMAGES.audio,
      badge: "TOP RATED",
      badgeVariant: "emerald",
      href: "/items?category=Audio",
    },
  ],
  actions: [
    {
      label: "View All Products",
      href: "/items",
      variant: "primary",
      icon: "arrow",
    },
    {
      label: "Explore Department Directory",
      href: "/categories",
      variant: "secondary",
      icon: "grid",
    },
  ],
};

/**
 * Editorial Mega Menu Configuration for "Items".
 * High-speed 3-column link stack + 2-card visual merchandising showcase.
 * Reuses CURATED_COLLECTIONS, QUICK_SHOP_FILTERS, and PRODUCT_CATEGORIES with zero duplication.
 */
export const ITEMS_MEGA_MENU_CONFIG: MegaMenuConfig = {
  columns: [
    {
      kicker: "Curated Collections",
      items: CURATED_COLLECTIONS,
    },
    {
      kicker: "Price & Value Tiers",
      items: QUICK_SHOP_FILTERS,
    },
    {
      kicker: "Browse By Department",
      items: ["furniture", "audio", "carry"].map(toDepartmentLink),
      footerLink: {
        label: "Browse Complete Catalog Index →",
        href: "/items",
      },
    },
  ],
  merchandise: [
    {
      id: "merch-walnut-tray",
      title: "Solid Walnut Charging Tray",
      subtitle: "Dual Qi fast-wireless dock carved from American walnut",
      category: "Tech",
      price: 89,
      compareAtPrice: 110,
      image: CATEGORY_FALLBACK_IMAGES.tech,
      badge: "STAFF PICK",
      badgeVariant: "dark",
      href: "/items?category=Tech",
    },
    {
      id: "merch-alloy-lamp",
      title: "Matte Alloy Desk Lamp",
      subtitle: "3000K warm diffused architectural illumination",
      category: "Living",
      price: 149,
      image: CATEGORY_FALLBACK_IMAGES.living,
      badge: "POPULAR",
      badgeVariant: "amber",
      href: "/items?category=Living",
    },
  ],
  actions: [
    {
      label: "Browse Complete Catalog",
      href: "/items",
      variant: "primary",
      icon: "arrow",
    },
    {
      label: "Browse by Department",
      href: "/categories",
      variant: "secondary",
      icon: "grid",
    },
  ],
};

/**
 * Popular search term suggestions for the Search Overlay drawer.
 * NOTE: Acts as the high-availability static baseline & zero-CLS fallback.
 * Dynamic aggregation via `/api/search/trending` is scheduled for Phase 26 in TODO.md.
 */
export const POPULAR_SEARCH_TERMS = [
  "Ergonomic Chair",
  "Mechanical Keyboard",
  "Noise-Cancelling",
  "Desk Lamp",
  "Leather Backpack",
  "Solid Walnut",
] as const;

/**
 * Re-export department categories so mega menu components can import from navigation SSOT.
 */
export { PRODUCT_CATEGORIES };
export type { ProductCategory };
