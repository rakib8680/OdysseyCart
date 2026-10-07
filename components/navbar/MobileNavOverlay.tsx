"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Search,
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  LogOut,
  ArrowRight,
  Armchair,
  Headphones,
  Laptop,
  Lamp,
  Briefcase,
  Footprints,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { NavBrand } from "@/components/navbar/NavBrand";
import {
  NAV_LINKS,
  PRODUCT_CATEGORIES,
  CURATED_COLLECTIONS,
  NAV_BADGE_STYLES,
} from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

// Icon mapping for the 6 departments
const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  furniture: Armchair,
  audio: Headphones,
  tech: Laptop,
  living: Lamp,
  carry: Briefcase,
  footwear: Footprints,
};

export interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  className?: string;
}

/**
 * Cinematic full-screen mobile menu drawer.
 * Features staggered typography, department accordion, live wishlist/cart badges,
 * role-aware auth controls, and strict body scroll locking.
 */
export function MobileNavOverlay({
  isOpen,
  onClose,
  onOpenSearch,
  className,
}: MobileNavOverlayProps) {
  const pathname = usePathname();
  const { user, dbUser, loading: authLoading } = useAuth();
  const logout = useLogout();
  const { itemCount, openCart } = useCart();
  const wishlistIds = useWishlistIds();
  const wishlistCount = wishlistIds.length;

  // Accordion state for expandable categories & items menus
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [itemsExpanded, setItemsExpanded] = useState(false);


  // Lock body scroll and register Escape dismissal
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  const handleCartClick = () => {
    onClose();
    openCart();
  };

  const isActive = (href: string, exact = false) => {
    if (exact || href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className={cn(
        "fixed inset-0 z-50 bg-white flex flex-col md:hidden animate-in fade-in slide-in-from-top-2 duration-250",
        className,
      )}
    >
      {/* 1. Header Bar: Brand + Quick Actions (Search, Cart, Close) */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 shrink-0">
        <NavBrand onClick={onClose} />

        <div className="flex items-center gap-1">
          {/* Search Trigger */}
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Search catalog"
          >
            <Search className="w-4.5 h-4.5 stroke-[1.8]" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-slate-900 border-2 border-white rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 ml-1 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Navigation Routes */}
        <nav className="flex flex-col space-y-1">
          {NAV_LINKS.map((link, idx) => {
            const indexNumber = String(idx + 1).padStart(2, "0");
            const active = isActive(link.href, link.exact);

            if (link.menuKey === "categories") {
              return (
                <div
                  key={link.name}
                  className="border-b border-slate-100/70"
                >
                  <div className="flex items-center justify-between py-2.5">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "font-heading text-2xl font-bold tracking-tight transition-colors",
                        active
                          ? "text-emerald-600"
                          : "text-slate-900 hover:text-emerald-600",
                      )}
                    >
                      {link.name}
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Toggle categories accordion"
                        aria-expanded={categoriesExpanded}
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            categoriesExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {indexNumber}
                      </span>
                    </div>
                  </div>

                  {/* Expandable 6 Department Subgrid */}
                  {categoriesExpanded && (
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-3 animate-in fade-in duration-200">
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const IconComponent =
                          CATEGORY_ICON_MAP[cat.id] || Sparkles;

                        return (
                          <Link
                            key={cat.id}
                            href={cat.href}
                            onClick={onClose}
                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div
                              className={cn(
                                "w-6 h-6 rounded flex items-center justify-center shrink-0",
                                cat.bgColor,
                                cat.iconColor,
                              )}
                            >
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {cat.name}
                            </span>
                          </Link>
                        );
                      })}

                      <Link
                        href="/categories"
                        onClick={onClose}
                        className="col-span-2 inline-flex items-center justify-between p-2 mt-1 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors"
                      >
                        <span>Browse All Categories Directory</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            if (link.menuKey === "items") {
              return (
                <div
                  key={link.name}
                  className="border-b border-slate-100/70"
                >
                  <div className="flex items-center justify-between py-2.5">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "font-heading text-2xl font-bold tracking-tight transition-colors",
                        active
                          ? "text-emerald-600"
                          : "text-slate-900 hover:text-emerald-600",
                      )}
                    >
                      {link.name}
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setItemsExpanded(!itemsExpanded)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Toggle items collections accordion"
                        aria-expanded={itemsExpanded}
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            itemsExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {indexNumber}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Curated Collections */}
                  {itemsExpanded && (
                    <div className="flex flex-col gap-1.5 pt-1 pb-3 animate-in fade-in duration-200">
                      {CURATED_COLLECTIONS.map((col) => (
                        <Link
                          key={col.id}
                          href={col.href}
                          onClick={onClose}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-xs font-medium text-slate-700">
                            {col.name}
                          </span>
                          {col.badge && (
                            <span
                              className={cn(
                                "px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-full border shrink-0",
                                NAV_BADGE_STYLES[col.badgeVariant || "slate"]
                              )}
                            >
                              {col.badge}
                            </span>
                          )}
                        </Link>
                      ))}

                      <Link
                        href="/items"
                        onClick={onClose}
                        className="inline-flex items-center justify-between p-2 mt-1 rounded-lg text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <span>Browse Complete Catalog</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={link.name}
                className="flex items-center justify-between py-2.5 border-b border-slate-100/70"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "font-heading text-2xl font-bold tracking-tight transition-colors",
                    active
                      ? "text-emerald-600"
                      : "text-slate-900 hover:text-emerald-600",
                  )}
                >
                  {link.name}
                </Link>

                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {indexNumber}
                </span>
              </div>
            );
          })}
        </nav>

        {/* 3. Unified Account & Utilities Section */}
        <div className="pt-3 border-t border-slate-100/80">
          {authLoading ? (
            <div className="h-40 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse" />
          ) : user ? (
            /* Logged-In User: Unified Member Hub Card */
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3">
              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <UserAvatar
                  photoURL={user.photoURL}
                  displayName={user.displayName}
                  email={user.email}
                  size="md"
                  className="border border-slate-200/80 shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.displayName || user.email?.split("@")[0] || "Valued Customer"}
                    </p>
                    {dbUser?.role === "admin" && (
                      <span className="px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Account Actions List */}
              <div className="border-t border-slate-200/60 pt-2 space-y-0.5">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span>My Account & Orders</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/account/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    <span>Saved Wishlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {wishlistCount > 0 ? (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 rounded-full">
                        {wishlistCount}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">0</span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>

                {dbUser?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Admin Dashboard</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )}
              </div>

              {/* Sign Out Action */}
              <div className="border-t border-slate-200/60 pt-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2.5 py-1.5 w-full text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-colors cursor-pointer group"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Guest: Saved Wishlist + Dual Auth CTAs */
            <div className="space-y-3">
              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-2xs group-hover:text-rose-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Saved Wishlist</p>
                    <p className="text-[11px] text-slate-500">View your favorite products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wishlistCount > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 rounded-full">
                      {wishlistCount}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">0</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center py-2.5 px-4 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center py-2.5 px-4 text-center rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-2xs"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
