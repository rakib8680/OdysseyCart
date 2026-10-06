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

  // Close mobile drawer on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

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
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
        {/* Navigation Routes */}
        <nav className="flex flex-col space-y-1">
          {NAV_LINKS.map((link, idx) => {
            const indexNumber = String(idx + 1).padStart(2, "0");
            const active = isActive(link.href, link.exact);

            if (link.menuKey === "categories") {
              return (
                <div
                  key={link.name}
                  className="border-b border-slate-100/70 pb-2"
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

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        {indexNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Toggle categories accordion"
                      >
                        <ChevronDown
                          className={cn(
                            "w-4.5 h-4.5 transition-transform duration-200",
                            categoriesExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable 6 Department Subgrid */}
                  {categoriesExpanded && (
                    <div className="grid grid-cols-2 gap-2 pt-2 pb-3 animate-in fade-in duration-200">
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
                  className="border-b border-slate-100/70 pb-2"
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

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        {indexNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => setItemsExpanded(!itemsExpanded)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Toggle items collections accordion"
                      >
                        <ChevronDown
                          className={cn(
                            "w-4.5 h-4.5 transition-transform duration-200",
                            itemsExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Curated Collections */}
                  {itemsExpanded && (
                    <div className="flex flex-col gap-1.5 pt-2 pb-3 animate-in fade-in duration-200">
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

                <span className="text-xs font-mono text-slate-400">
                  {indexNumber}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Wishlist Link */}
        <div>
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4.5 h-4.5 text-slate-600" />
              <span className="text-sm font-semibold text-slate-900">
                My Saved Wishlist
              </span>
            </div>
            {wishlistCount > 0 ? (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-emerald-600 rounded-full">
                {wishlistCount}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-400">
                0 saved
              </span>
            )}
          </Link>
        </div>

        {/* Authentication & Account Section */}
        <div className="pt-4 border-t border-slate-100">
          {authLoading ? (
            <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
          ) : user ? (
            /* Logged-In User Profile Card & Actions */
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <UserAvatar
                  photoURL={user.photoURL}
                  displayName={user.displayName}
                  email={user.email}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user.displayName || "Valued Customer"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Account & Orders</span>
                </Link>

                {dbUser?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Guest Actions */
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full py-2.5 px-4 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-xs"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
