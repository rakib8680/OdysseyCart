import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

// ==========================================
// PROPS
// ==========================================
interface CollectionHeroProps {
  activeCategory?: string;
  totalCount: number;
}

// ==========================================
// COLLECTION HERO COMPONENT
// ==========================================
/**
 * Editorial hero banner for the Collection page.
 * Follows the same design language as the Contact page header
 * (pill badge → bold title → subtitle → contextual info).
 *
 * Pure Server Component — no client-side state needed.
 */
export function CollectionHero({
  activeCategory,
  totalCount,
}: CollectionHeroProps) {
  const title = activeCategory || "Collection";
  const subtitle = activeCategory
    ? `Browse our curated ${activeCategory.toLowerCase()} selection.`
    : "Explore our premium selection of gear and accessories.";

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white border-b border-slate-100">
      {/* Geometric accents — consistent with homepage hero */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-125 h-125 rounded-full border border-emerald-100/50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-87.5 h-87.5 rounded-full border border-slate-200/40 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-8 md:pt-14 md:pb-10 relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 mb-6"
        >
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {activeCategory ? (
            <>
              <Link
                href="/items"
                className="hover:text-slate-600 transition-colors"
              >
                Collection
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-600 font-medium">
                {activeCategory}
              </span>
            </>
          ) : (
            <span className="text-slate-600 font-medium">Collection</span>
          )}
        </nav>

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium Collection</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mb-6">
          {subtitle}
        </p>

        {/* Divider + Result Count */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 max-w-16 bg-slate-200" />
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-600">{totalCount}</span>{" "}
            {totalCount === 1 ? "product" : "products"}
          </p>
        </div>
      </div>
    </section>
  );
}
