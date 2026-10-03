import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles } from "lucide-react";
import { getCategoryDirectoryData } from "@/lib/data/products";
import { CategoryDirectoryCard } from "@/components/categories/CategoryDirectoryCard";
import { constructMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = constructMetadata({
  title: "All Departments & Product Categories",
  description:
    "Explore our complete directory of curated shopping departments, from precision audio and connected tech to ergonomic furniture and daily accessories.",
  url: "/categories",
});

/**
 * All Categories Directory Page (Server Component)
 *
 * Provides a dedicated, high-intent department hub:
 * 1. Breadcrumbs & Header: Immediate contextual navigation and department inventory badge.
 * 2. Photographic Grid: Responsive 3-column cards with live counts and starting prices.
 * 3. SSOT Integration: Pulls directly from MongoDB via `getCategoryDirectoryData`.
 */
export default async function CategoriesPage() {
  const categories = await getCategoryDirectoryData();
  const totalProducts = categories.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="app-container pt-8 sm:pt-10 pb-24 sm:pb-32">
        {/* 1. Header & Breadcrumbs Shell */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4"
          >
            <Link
              href="/"
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Categories</span>
          </nav>

          {/* Department Count Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/70 mb-3 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {categories.length} Curated Departments • {totalProducts} Total Products
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Shop All Departments
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2.5">
            Discover our full directory of product categories, from precision audio
            and ergonomic seating to everyday carry essentials. Select a department
            below to explore available collections.
          </p>
        </div>

        {/* 2. Responsive Photographic Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <CategoryDirectoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
