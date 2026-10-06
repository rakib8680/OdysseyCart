import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/config/products";

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

export interface MegaMenuLinkItem {
  id: string;
  name: string;
  href: string;
  badge?: string | null;
  badgeVariant?: "emerald" | "amber" | "slate" | "rose";
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
  badgeVariant?: "emerald" | "amber" | "dark";
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

export interface QuickShopFilter {
  id: string;
  label: string;
  href: string;
  badge?: string | null;
  badgeVariant?: "emerald" | "amber" | "slate" | "rose";
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
 * Curated shopping collections.
 * Consumed by MobileNavOverlay drawer and derived in ITEMS_MEGA_MENU_CONFIG.
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
 * Consumed by legacy filter panels and derived in ITEMS_MEGA_MENU_CONFIG.
 */
export const QUICK_SHOP_FILTERS: QuickShopFilter[] = [
  {
    id: "sale",
    label: "On Sale & Special Offers",
    href: "/items",
    badge: "Sale",
    badgeVariant: "rose",
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
 * Departments are strictly derived from PRODUCT_CATEGORIES SSOT.
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
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
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
 * Derived directly from CURATED_COLLECTIONS, QUICK_SHOP_FILTERS, and PRODUCT_CATEGORIES.
 */
export const ITEMS_MEGA_MENU_CONFIG: MegaMenuConfig = {
  columns: [
    {
      kicker: "Curated Collections",
      items: CURATED_COLLECTIONS.map(({ id, name, href, badge, badgeVariant }) => ({
        id: `item-${id}`,
        name,
        href,
        badge,
        badgeVariant,
      })),
    },
    {
      kicker: "Price & Value Tiers",
      items: QUICK_SHOP_FILTERS.map((filter) => ({
        id: `item-${filter.id}`,
        name: filter.label,
        href: filter.href,
        badge: filter.badge,
        badgeVariant: filter.badgeVariant || (filter.id === "sale" ? "rose" : "slate"),
      })),
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
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
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
 * Curated spotlight feature inside the legacy "Categories" Mega Menu.
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
 * Featured product showcase card inside legacy "Items" Mega Menu.
 * Derived directly from CATEGORIES_MEGA_MENU_CONFIG merchandise to maintain DRY SSOT.
 */
export const PRODUCT_OF_THE_WEEK: ProductOfTheWeek = {
  eyebrow: "PRODUCT OF THE WEEK",
  title: CATEGORIES_MEGA_MENU_CONFIG.merchandise[0].title,
  category: CATEGORIES_MEGA_MENU_CONFIG.merchandise[0].category,
  price: CATEGORIES_MEGA_MENU_CONFIG.merchandise[0].price,
  image: CATEGORIES_MEGA_MENU_CONFIG.merchandise[0].image,
  badge: "Staff Favorite",
  ctaText: "View Product →",
  ctaHref: CATEGORIES_MEGA_MENU_CONFIG.merchandise[0].href,
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
