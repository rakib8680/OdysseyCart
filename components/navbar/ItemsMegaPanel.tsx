"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Flame,
  Award,
  PackageCheck,
  Tag,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  CURATED_COLLECTIONS,
  QUICK_SHOP_FILTERS,
  PRODUCT_OF_THE_WEEK,
} from "@/lib/config/navigation";
import { formatPrice } from "@/lib/utils/pricing";

const COLLECTION_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "new-arrivals": Sparkles,
  "best-sellers": Flame,
  "staff-picks": Award,
  "in-stock": PackageCheck,
};

interface ItemsMegaPanelProps {
  onItemClick?: () => void;
}

/**
 * Items Mega Menu panel displaying curated collections, quick price filters,
 * and a live Product of the Week spotlight card.
 */
export function ItemsMegaPanel({ onItemClick }: ItemsMegaPanelProps) {
  return (
    <div className="app-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Curated Collections (4 cols) */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Curated Collections
            </span>
            <span className="text-xs font-medium text-slate-500">
              By Intent
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mt-3">
            {CURATED_COLLECTIONS.map((col) => {
              const Icon = COLLECTION_ICON_MAP[col.id] || Sparkles;

              return (
                <Link
                  key={col.id}
                  href={col.href}
                  onClick={onItemClick}
                  className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover/item:text-emerald-600 transition-colors">
                        {col.name}
                      </span>
                      {col.badge && (
                        <span
                          className={`px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            col.badgeVariant === "emerald"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : col.badgeVariant === "amber"
                                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {col.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {col.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: Shop by Price & Deals (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Shop By Price & Deals
              </span>
              <span className="text-xs font-medium text-slate-500">
                Quick Filters
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mt-3">
              {QUICK_SHOP_FILTERS.map((filter) => (
                <Link
                  key={filter.id}
                  href={filter.href}
                  onClick={onItemClick}
                  className="group/filter flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400 group-hover/filter:text-slate-900 transition-colors" />
                    <span className="text-xs font-medium text-slate-700 group-hover/filter:text-slate-900 transition-colors">
                      {filter.label}
                    </span>
                  </div>

                  {filter.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full">
                      {filter.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Full Catalog Link */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/items"
              onClick={onItemClick}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-emerald-600 transition-colors group/link"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Browse Complete Catalog (All Products)</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Column 3: Product of the Week Spotlight (4 cols) */}
        <div className="lg:col-span-4">
          <Link
            href={PRODUCT_OF_THE_WEEK.ctaHref}
            onClick={onItemClick}
            className="group/potw block p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-100/60 transition-colors shadow-2xs"
          >
            <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-slate-200 mb-3">
              <Image
                src={PRODUCT_OF_THE_WEEK.image}
                alt={PRODUCT_OF_THE_WEEK.title}
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover transition-transform duration-500 group-hover/potw:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-slate-900 rounded-full shadow-2xs">
                {PRODUCT_OF_THE_WEEK.badge}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>{PRODUCT_OF_THE_WEEK.eyebrow}</span>
              <span className="text-emerald-600 font-semibold">
                {PRODUCT_OF_THE_WEEK.category}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 group-hover/potw:text-emerald-600 transition-colors">
              {PRODUCT_OF_THE_WEEK.title}
            </h4>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
              <span className="text-sm font-bold text-slate-900">
                {formatPrice(PRODUCT_OF_THE_WEEK.price)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover/potw:translate-x-0.5 transition-transform">
                {PRODUCT_OF_THE_WEEK.ctaText}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
