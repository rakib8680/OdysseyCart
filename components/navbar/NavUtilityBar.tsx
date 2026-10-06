"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { AccountDropdown } from "@/components/navbar/AccountDropdown";
import { cn } from "@/lib/utils";

export interface NavUtilityBarProps {
  onOpenSearch: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

/**
 * Luxury 4-item utility icon bar housing Search, Wishlist, Cart Drawer trigger,
 * Account state / popover, and responsive mobile toggle.
 */
export function NavUtilityBar({
  onOpenSearch,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onMouseEnter,
  className,
}: NavUtilityBarProps) {
  const { user, loading: authLoading } = useAuth();
  const { itemCount, openCart } = useCart();
  const wishlistIds = useWishlistIds();
  const wishlistCount = wishlistIds.length;

  return (
    <div
      className={cn("flex items-center gap-1 sm:gap-2", className)}
      onMouseEnter={onMouseEnter}
    >
      {/* 1. Search Trigger Button */}
      <button
        onClick={onOpenSearch}
        className="group relative flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 cursor-pointer"
        aria-label="Search products (Press ⌘K or /)"
        title="Search products (⌘K)"
      >
        <Search className="w-4.5 h-4.5 stroke-[1.7] transition-transform duration-200 group-hover:scale-105" />
      </button>

      {/* 2. Wishlist Icon Button */}
      <Link
        href="/account/wishlist"
        className="group relative flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
        aria-label={`Wishlist with ${wishlistCount} saved items`}
        title="Wishlist"
      >
        <Heart className="w-4.5 h-4.5 stroke-[1.7] transition-transform duration-200 group-hover:scale-105" />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-emerald-600 border-2 border-white rounded-full shadow-2xs select-none">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
        )}
      </Link>

      {/* 3. Cart Trigger Button */}
      <button
        onClick={openCart}
        className="group relative flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 cursor-pointer"
        aria-label={`Shopping bag with ${itemCount} items`}
        title="Shopping Bag"
      >
        <ShoppingBag className="w-4.5 h-4.5 stroke-[1.7] transition-transform duration-200 group-hover:scale-105" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10.5px] font-bold text-white bg-slate-900 border-2 border-white rounded-full shadow-xs select-none">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {/* 4. Account State: Skeleton | Popover | Guest Auth */}
      <div className="flex items-center ml-1">
        {authLoading ? (
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        ) : user ? (
          <AccountDropdown />
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* 5. Mobile Menu Toggle Hamburger */}
      <button
        onClick={onToggleMobileMenu}
        className="md:hidden flex items-center justify-center w-9 h-9 ml-1 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 cursor-pointer"
        aria-label={
          isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 stroke-2" />
        ) : (
          <Menu className="w-5 h-5 stroke-2" />
        )}
      </button>
    </div>
  );
}
