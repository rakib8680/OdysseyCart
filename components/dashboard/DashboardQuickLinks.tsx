"use client";

import Link from "next/link";
import { type MenuItem } from "@/lib/config/dashboard";

interface DashboardQuickLinksProps {
  menuItems: MenuItem[];
  /** The root path to exclude (e.g., "/account" or "/admin") */
  excludeHref: string;
  /** Map of href → short description text */
  descriptions: Record<string, string>;
}

/**
 * Quick link cards for any dashboard overview page.
 * Reads from the same menu config used by the sidebar (DRY).
 * Filters out the root overview item since we're already on it.
 */
export function DashboardQuickLinks({
  menuItems,
  excludeHref,
  descriptions,
}: DashboardQuickLinksProps) {
  const links = menuItems.filter((item) => item.href !== excludeHref);

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900 mb-3">Quick Links</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500">
                  {descriptions[item.href] || ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
