"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  type MenuItem,
  ADMIN_THEME,
  ACCOUNT_THEME,
} from "@/lib/config/dashboard";

interface DashboardSidebarItemProps {
  item: MenuItem;
}

/** Single sidebar nav link — icon, label, active highlight */
export function DashboardSidebarItem({ item }: DashboardSidebarItemProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const theme = isAdmin ? ADMIN_THEME : ACCOUNT_THEME;

  // Exact match for root paths (/account, /admin), startsWith for sub-routes
  const isActive =
    item.href === "/account" || item.href === "/admin"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? theme.activeBg
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] flex-shrink-0",
          isActive ? theme.activeIcon : "text-slate-400",
        )}
      />
      {item.label}
    </Link>
  );
}
