"use client";

import { useEffect } from "react";
import {
  MegaMenuKey,
  CATEGORIES_MEGA_MENU_CONFIG,
  ITEMS_MEGA_MENU_CONFIG,
} from "@/lib/config/navigation";
import { MegaMenuPanel } from "@/components/navbar/mega-menu";
import { cn } from "@/lib/utils";

export interface MegaMenuProps {
  activeMenu: MegaMenuKey | null;
  onClose: () => void;
  onMouseEnterMenu: () => void;
  onMouseLeaveMenu: () => void;
  className?: string;
}

/**
 * Editorial Mega Menu orchestrator container.
 * Features instant 25ms trigger, hardware-accelerated 100ms fade transition,
 * seamless 0ms cross-menu gliding, and Escape key dismissal.
 */
export function MegaMenu({
  activeMenu,
  onClose,
  onMouseEnterMenu,
  onMouseLeaveMenu,
  className,
}: MegaMenuProps) {
  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeMenu) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu, onClose]);

  if (!activeMenu) {
    return null;
  }

  return (
    <div
      id="mega-menu-panel"
      role="region"
      aria-label="Navigation mega menu"
      onMouseEnter={onMouseEnterMenu}
      onMouseLeave={onMouseLeaveMenu}
      className={cn(
        "hidden md:block absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xl shadow-slate-900/10 z-50 animate-in fade-in duration-100 ease-out origin-top",
        className
      )}
    >
      {activeMenu === "categories" && (
        <MegaMenuPanel
          config={CATEGORIES_MEGA_MENU_CONFIG}
          onItemClick={onClose}
        />
      )}
      {activeMenu === "items" && (
        <MegaMenuPanel
          config={ITEMS_MEGA_MENU_CONFIG}
          onItemClick={onClose}
        />
      )}
    </div>
  );
}
