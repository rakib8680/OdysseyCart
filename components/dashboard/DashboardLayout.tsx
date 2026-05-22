"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { type MenuItem } from "@/lib/config/dashboard";
import { type LucideIcon, Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  title: string;
  bottomAction: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    href?: string;
  };
}

/**
 * Shared dashboard shell — sidebar on left, content on right.
 * Used by both /account and /admin layouts with different configs.
 * Handles responsive: fixed sidebar on desktop, slide-out overlay on mobile.
 */
export function DashboardLayout({
  children,
  menuItems,
  title,
  bottomAction,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex">
        {/* ───── Desktop Sidebar ───── */}
        <div className="hidden lg:block flex-shrink-0 sticky top-16 h-[calc(100vh-64px)]">
          <DashboardSidebar
            menuItems={menuItems}
            title={title}
            bottomAction={bottomAction}
          />
        </div>

        {/* ───── Mobile Sidebar Overlay ───── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Sidebar Panel */}
            <div className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-200">
              <DashboardSidebar
                menuItems={menuItems}
                title={title}
                bottomAction={bottomAction}
              />
            </div>
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-[272px] p-1.5 rounded-full bg-white shadow-md text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ───── Content Area ───── */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header Bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {title}
            </h2>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
