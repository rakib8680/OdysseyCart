import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategoryShowcaseData } from "@/lib/data/products";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  tech: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  furniture: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  accessories: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
};

/**
 * CategoryShowcase Component (Server Component)
 *
 * Upgrades category navigation into full-bleed photographic cards
 * with live item counts and smooth hover states. Uses standardized SectionHeader.
 */
export async function CategoryShowcase() {
  const categories = await getCategoryShowcaseData();

  return (
    <section className={`bg-white border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}>
      <div className={HOMEPAGE_TOKENS.container}>
        {/* Standardized Section Header */}
        <SectionHeader
          title="Shop by Category"
          subtitle="Browse our carefully engineered selection across tech, ergonomic furniture, and everyday accessories."
          action={{
            label: "View All",
            href: "/items",
          }}
        />

        {/* 3-Column Photographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => {
            const displayImage =
              category.featuredImage ||
              CATEGORY_FALLBACK_IMAGES[category.id] ||
              FALLBACK_PRODUCT_IMAGE;

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`group relative aspect-4/3 md:aspect-3/4 ${HOMEPAGE_TOKENS.cardRadius} overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-5 sm:p-8`}
              >
                {/* Background Image: Bright, crisp, and natural */}
                <img
                  src={displayImage}
                  alt={category.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle bottom vignette specifically for text contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 via-45% to-transparent pointer-events-none" />

                {/* Top Pill Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-xs border border-white/60">
                    {category.name}
                  </span>

                  <span className="px-2.5 sm:px-3 py-1 bg-slate-900/75 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-white rounded-full border border-slate-700/40 shadow-xs">
                    {category.itemCount} {category.itemCount === 1 ? "Product" : "Products"}
                  </span>
                </div>

                {/* Bottom Story & Call to Action */}
                <div className="relative z-10 pt-6 sm:pt-16">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                      {category.label}
                    </h3>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 shadow-sm shrink-0">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <span>Shop Now</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
