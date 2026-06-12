import {
  LayoutDashboard,
  Package,
  MapPin,
  BarChart3,
  ShoppingBag,
  Star,
  type LucideIcon,
} from "lucide-react";

// ==========================================
// SHARED MENU ITEM TYPE
// ==========================================
export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// ==========================================
// USER ACCOUNT SIDEBAR MENU
// ==========================================
export const ACCOUNT_MENU: MenuItem[] = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
];

// ==========================================
// ADMIN DASHBOARD SIDEBAR MENU
// ==========================================
export const ADMIN_MENU: MenuItem[] = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

// ==========================================
// BREADCRUMB SEGMENT LABELS
// ==========================================
/** Maps raw URL segments to human-readable breadcrumb labels */
export const SEGMENT_LABELS: Record<string, string> = {
  account: "My Account",
  admin: "Admin",
  orders: "Orders",
  products: "Products",
  reviews: "Reviews",
  addresses: "Addresses",
  add: "Add New",
  edit: "Edit",
};

// ==========================================
// DASHBOARD VIEW THEMES
// ==========================================
export interface DashboardTheme {
  name: "account" | "admin";
  activeBg: string;
  activeText: string;
  activeIcon: string;
  badgeBg: string;
}

export const ACCOUNT_THEME: DashboardTheme = {
  name: "account",
  activeBg: "bg-emerald-50 text-emerald-700 shadow-sm",
  activeText: "text-emerald-700",
  activeIcon: "text-emerald-600",
  badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const ADMIN_THEME: DashboardTheme = {
  name: "admin",
  activeBg: "bg-indigo-50 text-indigo-700 shadow-sm",
  activeText: "text-indigo-700",
  activeIcon: "text-indigo-600",
  badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200",
};
