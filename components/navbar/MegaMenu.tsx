"use client";

import { useEffect } from "react";
import { MegaMenuKey } from "@/lib/config/navigation";
import { CategoriesMegaPanel } from "@/components/navbar/CategoriesMegaPanel";
import { ItemsMegaPanel } from "@/components/navbar/ItemsMegaPanel";
import { cn } from "@/lib/utils";

export interface MegaMenuProps {
  activeMenu: MegaMenuKey | null;
  onClose: () => void;
  onMouseEnterMenu: () => void;
  onMouseLeaveMenu: () => void;
  className?: string;
}

/**
 * Dual Mega Menu orchestrator container.
 * Features an atmospheric backdrop scrim, hardware-accelerated slide-in transitions,
 * seamless cross-menu gliding, and Escape key dismissal.
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
    <>
      {/* 1. Atmospheric Backdrop Focus Scrim */}
      <div
        className="fixed inset-x-0 bottom-0 top-16 bg-slate-950/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Full-Width Mega Menu Panel */}
      <div
        role="region"
        aria-label="Navigation mega menu"
        onMouseEnter={onMouseEnterMenu}
        onMouseLeave={onMouseLeaveMenu}
        className={cn(
          "absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top",
          className
        )}
      >
        {activeMenu === "categories" && (
          <CategoriesMegaPanel onItemClick={onClose} />
        )}
        {activeMenu === "items" && (
          <ItemsMegaPanel onItemClick={onClose} />
        )}
      </div>
    </>
  );
}
