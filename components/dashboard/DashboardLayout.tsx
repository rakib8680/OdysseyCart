"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { type MenuItem } from "@/lib/config/dashboard";
import { type LucideIcon, X } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto flex">
        {/* ───── Desktop Sidebar ───── */}
        <div className="hidden lg:block flex-shrink-0 sticky top-0 h-screen">
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
          <DashboardHeader
            onMobileMenuOpen={() => setMobileOpen(true)}
            title={title}
          />

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8 container mx-auto mb-32">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
