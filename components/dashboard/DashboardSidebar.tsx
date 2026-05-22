"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebarItem } from "./DashboardSidebarItem";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { type MenuItem } from "@/lib/config/dashboard";
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

/** Reusable sidebar panel — renders user info, menu items, and a bottom action */
export function DashboardSidebar({
  menuItems,
  title,
  bottomAction,
}: DashboardSidebarProps) {
  const { user } = useAuth();

  const BottomIcon = bottomAction.icon;

  return (
    <aside className="flex flex-col h-full w-[260px] bg-white border-r border-slate-200 p-4">
      {/* Dashboard Title */}
      <div className="px-3 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h2>
      </div>

      {/* User Info Card */}
      <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-slate-50">
        <UserAvatar
          photoURL={user?.photoURL}
          displayName={user?.displayName}
          email={user?.email}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {user?.displayName || "User"}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => (
          <DashboardSidebarItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Action */}
      <div className="border-t border-slate-100 pt-3 mt-3">
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
