"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils/pricing";
import {
  MegaMenuMerchandiseItem,
  MERCH_BADGE_STYLES,
} from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

interface MegaMenuMerchCardProps {
  item: MegaMenuMerchandiseItem;
  onItemClick?: () => void;
}

/**
 * Visual Merchandising Product Card.
 * Displays high-res photography, zoom-on-hover effect, status badges,
 * and live formatted pricing with zero Cumulative Layout Shift (CLS).
 */
export function MegaMenuMerchCard({
  item,
  onItemClick,
}: MegaMenuMerchCardProps) {
  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className="group/card flex flex-col p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/60 transition-all duration-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
    >
      {/* 1. Photography Container with Fixed Aspect Ratio (Zero CLS) */}
      <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-200 mb-2.5">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 50vw, 240px"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
        />
        {item.badge && (
          <span
            className={cn(
              "absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full shadow-2xs backdrop-blur-xs",
              MERCH_BADGE_STYLES[item.badgeVariant || "dark"]
            )}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* 2. Category & Micro-Interaction Arrow */}
      <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
        <span>{item.category}</span>
        <ArrowRight className="w-3 h-3 text-slate-400 group-hover/card:text-slate-900 group-hover/card:translate-x-0.5 transition-all duration-150" />
      </div>

      {/* 3. Product Title & Subtitle */}
      <h4 className="text-[13.5px] font-semibold text-slate-900 group-hover/card:text-emerald-700 transition-colors line-clamp-1">
        {item.title}
      </h4>
      <p className="text-[11.5px] text-slate-500 line-clamp-1 mt-0.5">
        {item.subtitle}
      </p>

      {/* 4. Formatted Price Row */}
      <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-slate-200/60">
        <span className="text-sm font-bold text-slate-900">
          {formatPrice(item.price)}
        </span>
        {item.compareAtPrice && item.compareAtPrice > item.price && (
          <span className="text-xs text-slate-400 line-through">
            {formatPrice(item.compareAtPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}
