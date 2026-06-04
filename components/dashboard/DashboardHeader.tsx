"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { ADMIN_THEME, ACCOUNT_THEME } from "@/lib/config/dashboard";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  onMobileMenuOpen: () => void;
  title: string;
}

/**
 * Sticky header bar for dashboard pages.
 * Shared by both /admin and /account — theme auto-detected via pathname.
 *
 * Left:  Mobile hamburger (lg:hidden) + Breadcrumbs (or title on root pages)
 * Right: User avatar + role indicator
 */
export function DashboardHeader({
  onMobileMenuOpen,
  title,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // On root dashboard pages (/admin, /account) breadcrumbs return null,
  // so we show the title as a fallback label.
  const segments = pathname.split("/").filter(Boolean);
  const isRootPage = segments.length <= 1;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
      {/* ── Left: Hamburger + Breadcrumbs ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isRootPage ? (
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        ) : (
          <DashboardBreadcrumbs />
        )}
      </div>

      {/* ── Right: User Quick Profile ── */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
        <UserAvatar
          photoURL={user?.photoURL}
          displayName={user?.displayName}
          email={user?.email}
          size="sm"
        />
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 line-clamp-1">
            {user?.displayName || "User"}
          </span>
          <span
            className={cn(
              "text-[9px] font-bold uppercase tracking-wider",
              isAdmin ? "text-indigo-600" : "text-emerald-600",
            )}
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
        </div>
      </div>
    </header>
  );
}
