"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Armchair,
  Headphones,
  Laptop,
  Lamp,
  Briefcase,
  Footprints,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/config/products";
import { CATEGORIES_SPOTLIGHT } from "@/lib/config/navigation";

// Explicit icon mapping for the 6 departments
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  furniture: Armchair,
  audio: Headphones,
  tech: Laptop,
  living: Lamp,
  carry: Briefcase,
  footwear: Footprints,
};

interface CategoriesMegaPanelProps {
  onItemClick?: () => void;
}

/**
 * Categories Mega Menu panel rendering the 6 store departments
 * alongside a seasonal curated spotlight card.
 */
export function CategoriesMegaPanel({ onItemClick }: CategoriesMegaPanelProps) {
  return (
    <div className="app-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6 Department Cards (8 cols on large screens) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Explore Departments
              </span>
              <span className="text-xs font-medium text-slate-500">
                6 Curated Categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {PRODUCT_CATEGORIES.map((category) => {
                const IconComponent = CATEGORY_ICON_MAP[category.id] || Layers;

                return (
                  <Link
                    key={category.id}
                    href={category.href}
                    onClick={onItemClick}
                    className="group/card flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200 border border-transparent hover:border-slate-200/60"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${category.bgColor} ${category.iconColor} transition-transform duration-200 group-hover/card:scale-105`}
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover/card:text-emerald-600 transition-colors">
                          {category.name}
                        </h4>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-200 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom All-Categories Hub Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/categories"
              onClick={onItemClick}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors group/link"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Browse All Categories Directory (with live stock counts)</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Curated Spotlight Banner (4 cols) */}
        <div className="lg:col-span-4">
          <Link
            href={CATEGORIES_SPOTLIGHT.ctaHref}
            onClick={onItemClick}
            className="group/spotlight relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-end min-h-65 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Background Lifestyle Image */}
            <Image
              src={CATEGORIES_SPOTLIGHT.image}
              alt={CATEGORIES_SPOTLIGHT.title}
              fill
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover transition-transform duration-700 ease-out group-hover/spotlight:scale-105"
            />

            {/* Gradient Scrim for readable text */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

            {/* Spotlight Content */}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/90 text-white rounded-full mb-2">
                {CATEGORIES_SPOTLIGHT.eyebrow}
              </span>
              <h3 className="font-heading font-bold text-lg text-white leading-snug">
                {CATEGORIES_SPOTLIGHT.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                {CATEGORIES_SPOTLIGHT.subtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-3 group-hover/spotlight:text-emerald-300 transition-colors">
                <span>{CATEGORIES_SPOTLIGHT.ctaText}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
