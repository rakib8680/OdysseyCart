"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  MegaMenuColumnConfig,
  NAV_BADGE_STYLES,
} from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

interface MegaMenuColumnProps {
  column: MegaMenuColumnConfig;
  onItemClick?: () => void;
}

/**
 * Editorial text-first navigation column.
 * High-legibility vertical link stack with uppercase section header,
 * subtle hover translate micro-interactions, and status badge chips.
 */
export function MegaMenuColumn({ column, onItemClick }: MegaMenuColumnProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/90 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {column.kicker}
          </span>
          {column.countLabel && (
            <span className="text-[11px] font-medium text-slate-400">
              {column.countLabel}
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-1" role="list">
          {column.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onItemClick}
                className="group/link flex items-center justify-between py-1 text-[13.5px] font-medium text-slate-600 hover:text-slate-950 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-xs"
              >
                <span className="group-hover/link:translate-x-1 transition-transform duration-150 inline-flex items-center gap-1.5">
                  {item.name}
                </span>

                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-full border shrink-0 transition-transform duration-150 group-hover/link:scale-105",
                      NAV_BADGE_STYLES[item.badgeVariant || "slate"]
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {column.footerLink && (
        <div className="pt-2 mt-2 border-t border-slate-100/80">
          <Link
            href={column.footerLink.href}
            onClick={onItemClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group/footer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/20 rounded-xs"
          >
            <span>{column.footerLink.label}</span>
            <ArrowRight className="w-3 h-3 group-hover/footer:translate-x-0.5 transition-transform duration-150" />
          </Link>
        </div>
      )}
    </div>
  );
}
