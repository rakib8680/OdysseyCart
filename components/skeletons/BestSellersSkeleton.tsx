import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * BestSellersSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for BestSellers carousel.
 */
export function BestSellersSkeleton() {
  return (
    <section className={`bg-white border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 lg:mb-14 gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="w-44 sm:w-56 h-8 sm:h-10 bg-slate-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-6 overflow-hidden pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-65 sm:w-70 lg:w-75 shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200/80 flex flex-col animate-pulse"
            >
              <div className="w-full aspect-square bg-slate-100" />
              <div className="p-2.5 sm:p-4 space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded-xs" />
                <div className="w-3/4 h-4 sm:h-5 bg-slate-200 rounded-xs" />
                <div className="w-1/2 h-3.5 sm:h-4 bg-slate-200 rounded-xs" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 px-1 animate-pulse">
          <div className="w-28 sm:w-40 h-1.5 bg-slate-200 rounded-full" />
          <div className="w-32 h-3 bg-slate-200 rounded-xs" />
        </div>
      </div>
    </section>
  );
}
