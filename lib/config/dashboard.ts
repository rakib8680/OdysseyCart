import {
  LayoutDashboard,
  Package,
  MapPin,
  BarChart3,
  ShoppingBag,
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
];
