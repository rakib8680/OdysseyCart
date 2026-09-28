import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getCategoryShowcaseData } from "@/app/actions/products";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  tech: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  furniture: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  accessories: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
};

/**
 * CategoryShowcase Component (Server Component)
 *
 * Upgrades category navigation from flat icon boxes into full-bleed
 * photographic editorial cards with live item counts and smooth hover states.
 */
export async function CategoryShowcase() {
  const categories = await getCategoryShowcaseData();

  return (
    <section className="py-24 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 mb-3 shadow-2xs">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Curated Domains</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Curated Collections
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
              Explore our selection of meticulously crafted products designed for the modern architectural home and workspace.
            </p>
          </div>

          <Link
            href="/items"
            className="group hidden md:inline-flex items-center text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3-Column Photographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const displayImage =
              category.featuredImage ||
              CATEGORY_FALLBACK_IMAGES[category.id] ||
              FALLBACK_PRODUCT_IMAGE;

            return (
              <Link
                key={category.id}
                href={category.href}
                className="group relative aspect-4/3 md:aspect-3/4 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-8"
              >
                {/* Background Image: Bright, crisp, and natural */}
                <img
                  src={displayImage}
                  alt={category.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle bottom vignette specifically for text contrast — leaves top 60% of image completely bright */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 via-45% to-transparent pointer-events-none" />

                {/* Top Pill Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-xs border border-white/60">
                    {category.name}
                  </span>

                  <span className="px-3 py-1 bg-slate-900/75 backdrop-blur-md text-[11px] font-semibold text-white rounded-full border border-slate-700/40 shadow-xs">
                    {category.itemCount} {category.itemCount === 1 ? "Product" : "Products"}
                  </span>
                </div>

                {/* Bottom Story & Call to Action */}
                <div className="relative z-10 pt-16">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                      {category.label}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 shadow-sm shrink-0">
                      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <span>Explore Lineup</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/items"
            className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
