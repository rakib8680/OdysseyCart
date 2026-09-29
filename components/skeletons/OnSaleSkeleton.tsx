import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * OnSaleSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for the OnSale deals grid.
 */
export function OnSaleSkeleton() {
  return (
    <section
      className={`bg-slate-50/70 border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}
    >
      <div className={HOMEPAGE_TOKENS.container}>
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 lg:mb-14 gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="w-36 sm:w-48 h-8 sm:h-10 bg-slate-200 rounded-xl" />
            <div className="w-64 sm:w-80 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="w-28 h-5 bg-slate-200 rounded-md" />
        </div>

        {/* 4-Column Grid Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`bg-white ${HOMEPAGE_TOKENS.cardRadius} border border-slate-200/80 p-3 sm:p-4 space-y-3 sm:space-y-4 animate-pulse`}
            >
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />
              <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded-xs" />
                <div className="w-3/4 h-4 sm:h-5 bg-slate-200 rounded-xs" />
                <div className="w-1/2 h-3.5 sm:h-4 bg-slate-200 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
