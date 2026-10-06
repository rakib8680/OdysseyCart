"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react";
import { MegaMenuActionPill } from "@/lib/config/navigation";
import { formatPrice, SHIPPING_THRESHOLD } from "@/lib/utils/pricing";
import { cn } from "@/lib/utils";

interface MegaMenuActionBarProps {
  actions: MegaMenuActionPill[];
  onItemClick?: () => void;
}

/**
 * Bottom conversion action bar for the Mega Menu.
 * Features symmetrical CTA pills and dynamic store benefit indicators
 * sourced from centralized pricing configuration.
 */
export function MegaMenuActionBar({
  actions,
  onItemClick,
}: MegaMenuActionBarProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-6 border-t border-slate-100">
      {/* Conversion Action Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        {actions.map((action) => {
          const isPrimary = action.variant === "primary";
          const IconComponent =
            action.icon === "grid"
              ? LayoutGrid
              : action.icon === "sparkles"
              ? Sparkles
              : ArrowRight;

          return (
            <Link
              key={action.label}
              href={action.href}
              onClick={onItemClick}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 group/pill select-none shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                isPrimary
                  ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xs active:scale-[0.98]"
                  : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]"
              )}
            >
              <span>{action.label}</span>
              <IconComponent
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-150",
                  action.icon === "arrow" && "group-hover/pill:translate-x-0.5",
                  action.icon === "sparkles" && "text-amber-400",
                  isPrimary
                    ? "text-slate-300 group-hover/pill:text-white"
                    : "text-slate-400 group-hover/pill:text-slate-700"
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* Trust & Guarantee Indicators (Sourced from SSOT Pricing Constants) */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
        <span>
          Free standard shipping on orders over{" "}
          {formatPrice(SHIPPING_THRESHOLD, { showCents: false })}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
        <span>30-day effortless returns</span>
      </div>
    </div>
  );
}
