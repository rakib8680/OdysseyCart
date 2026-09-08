import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

// ==========================================
// PROPS
// ==========================================
interface CollectionHeroProps {
  activeCategory?: string;
  showingCount?: number;
  totalCount?: number;
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
 * When rendered outside <Suspense> (without counts), the static shell
 * appears instantly. The dynamic "Showing X of Y" count streams in
 * separately via ProductCatalog.
 */
export function CollectionHero({
  activeCategory,
  showingCount,
  totalCount,
}: CollectionHeroProps) {
  const title = activeCategory || "All Products";
  const subtitle = activeCategory
    ? `Browse our curated ${activeCategory.toLowerCase()} selection.`
    : "Explore our premium selection of gear and accessories.";

  const hasCounts = totalCount !== undefined;
  const displayShowing =
    showingCount !== undefined ? showingCount : totalCount ?? 0;

  return (
    <div className="space-y-4 mb-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400"
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
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Premium Collection</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight capitalize">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl">
        {subtitle}
      </p>

      {/* Divider + Result Count — only rendered when DB data is available */}
      {hasCounts && (
        <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 max-w-16 bg-slate-200" />
          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {displayShowing}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
            {totalCount === 1 ? "product" : "products"}
          </p>
        </div>
      )}
    </div>
  );
}

