"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Shield, LogOut, ChevronDown, Heart, Package } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { cn } from "@/lib/utils";

interface AccountDropdownProps {
  className?: string;
}

/**
 * Refined user profile dropdown popover with smooth entrance physics,
 * outside-click dismissal, and role-aware navigation routes.
 */
export function AccountDropdown({ className }: AccountDropdownProps) {
  const { user, dbUser } = useAuth();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const isAdmin = dbUser?.role === "admin";
  const userDisplayName = user.displayName || user.email?.split("@")[0] || "User";

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User account menu"
      >
        <UserAvatar
          photoURL={user.photoURL}
          displayName={user.displayName}
          email={user.email}
          size="sm"
          className="border border-slate-200/80 shadow-2xs"
        />
        <span className="hidden lg:block text-xs font-semibold text-slate-800 max-w-28 truncate">
          {userDisplayName}
        </span>
        <ChevronDown
          className={cn(
            "hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-slate-900"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/8 border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-none"
        >
          {/* User Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {userDisplayName}
              </p>
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 text-slate-400" />
              My Account
            </Link>

            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              role="menuitem"
            >
              <Package className="w-4 h-4 text-slate-400" />
              Order History
            </Link>

            <Link
              href="/account/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              role="menuitem"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              Saved Items
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                role="menuitem"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
