"use client";

import { ViewMode } from "@/lib/types/product";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemsViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * View Mode Toggle Component.
 * Segmented button group providing instant switching between Grid and List catalog layouts.
 */
export function ItemsViewToggle({
  viewMode,
  onViewModeChange,
}: ItemsViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Catalog view mode"
      className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/60"
    >
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "p-1.5 rounded-md text-slate-500 hover:text-slate-900 transition-colors cursor-pointer",
          viewMode === "grid" &&
            "bg-white text-slate-900 shadow-xs font-semibold",
        )}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="List view"
        aria-pressed={viewMode === "list"}
        onClick={() => onViewModeChange("list")}
        className={cn(
          "p-1.5 rounded-md text-slate-500 hover:text-slate-900 transition-colors cursor-pointer",
          viewMode === "list" &&
            "bg-white text-slate-900 shadow-xs font-semibold",
        )}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
