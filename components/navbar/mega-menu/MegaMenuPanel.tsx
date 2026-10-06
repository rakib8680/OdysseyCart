"use client";

import { MegaMenuConfig } from "@/lib/config/navigation";
import { MegaMenuColumn } from "@/components/navbar/mega-menu/MegaMenuColumn";
import { MegaMenuMerchCard } from "@/components/navbar/mega-menu/MegaMenuMerchCard";
import { MegaMenuActionBar } from "@/components/navbar/mega-menu/MegaMenuActionBar";
import { cn } from "@/lib/utils";

export interface MegaMenuPanelProps {
  config: MegaMenuConfig;
  onItemClick?: () => void;
  className?: string;
}

/**
 * Editorial Mega Menu Panel.
 * Unifies the 3-column vertical text stacks with the 2-card visual merchandising
 * showcase and symmetrical bottom conversion action pills.
 *
 * Replaces legacy hardcoded panels with a 100% DRY, parameterized architecture.
 */
export function MegaMenuPanel({
  config,
  onItemClick,
  className,
}: MegaMenuPanelProps) {
  return (
    <div className={cn("app-container py-7", className)}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: 3 Editorial Text Columns (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          {config.columns.map((column) => (
            <MegaMenuColumn
              key={column.kicker}
              column={column}
              onItemClick={onItemClick}
            />
          ))}
        </div>

        {/* Right: 2 Visual Merchandising Product Cards (5 cols) */}
        <div className="md:col-span-5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/90 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Featured Merchandising
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Staff Curated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {config.merchandise.map((item) => (
              <MegaMenuMerchCard
                key={item.id}
                item={item}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Conversion Action Bar */}
      <MegaMenuActionBar
        actions={config.actions}
        onItemClick={onItemClick}
      />
    </div>
  );
}
