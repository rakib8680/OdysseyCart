"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebarItem } from "./DashboardSidebarItem";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import {
  type MenuItem,
  ADMIN_THEME,
  ACCOUNT_THEME,
} from "@/lib/config/dashboard";
import { type LucideIcon } from "lucide-react";

interface BottomAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  title: string;
  bottomAction: BottomAction;
}

/** Reusable sidebar panel — brand top, nav middle, user card bottom */
export function DashboardSidebar({
  menuItems,
  title,
  bottomAction,
}: DashboardSidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const theme = isAdmin ? ADMIN_THEME : ACCOUNT_THEME;

  const BottomIcon = bottomAction.icon;

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[260px] bg-white border-r p-4 transition-all duration-300",
        isAdmin
          ? "border-r-indigo-100 border-l-4 border-l-indigo-600"
          : "border-r-slate-200 border-l-0",
      )}
    >
      {/* ── Brand Logo ── */}
      <Link href="/" className="flex items-center gap-2 px-3 py-1 mb-6">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          O
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">
          ODYSSEY CART
        </span>
      </Link>

      {/* ── Contextual Section Label ── */}
      <div className="px-3 mb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h2>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => (
          <DashboardSidebarItem key={item.href} item={item} />
        ))}
      </nav>

      {/* ── User Info Card (Pinned to bottom) ── */}
      <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-slate-50 border border-slate-100">
        <UserAvatar
          photoURL={user?.photoURL}
          displayName={user?.displayName}
          email={user?.email}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.displayName || "User"}
            </p>
            {isAdmin && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded border",
                  theme.badgeBg,
                )}
              >
                Admin
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* ── Bottom Action ── */}
      <div className="border-t border-slate-100 pt-3">
        {bottomAction.href ? (
          <a
            href={bottomAction.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
          >
            <BottomIcon className="w-[18px] h-[18px]" />
            {bottomAction.label}
          </a>
        ) : (
          <button
            onClick={bottomAction.onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full cursor-pointer"
          >
            <BottomIcon className="w-[18px] h-[18px]" />
            {bottomAction.label}
          </button>
        )}
      </div>
    </aside>
  );
}
