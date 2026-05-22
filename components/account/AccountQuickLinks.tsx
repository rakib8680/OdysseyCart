"use client";

import Link from "next/link";
import { ACCOUNT_MENU } from "@/lib/config/dashboard";

/**
 * Quick link cards for the account overview page.
 * Reads from the same ACCOUNT_MENU config used by the sidebar (DRY).
 * Skips the "Overview" item since we're already on that page.
 */
export function AccountQuickLinks() {
  const links = ACCOUNT_MENU.filter((item) => item.href !== "/account");

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
                  {getDescription(item.href)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Map route to a human-readable description */
function getDescription(href: string): string {
  const descriptions: Record<string, string> = {
    "/account/orders": "View your past orders and track deliveries",
    "/account/addresses": "Manage your saved shipping addresses",
  };
  return descriptions[href] || "";
}
