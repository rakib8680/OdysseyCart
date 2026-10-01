import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * NewArrivalsSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for NewArrivals.
 */
export function NewArrivalsSkeleton() {
  return (
    <section className={`bg-slate-50/60 border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding} overflow-hidden`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 lg:mb-14 gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="w-48 sm:w-56 h-8 sm:h-10 bg-slate-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-6 overflow-hidden pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-52.5 xs:w-56.25 sm:w-67.5 md:w-75 lg:w-82.5 xl:w-87.5 shrink-0 bg-white rounded-xl p-4 space-y-4 animate-pulse"
            >
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />
              <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded-xs" />
                <div className="w-3/4 h-5 bg-slate-200 rounded-xs" />
                <div className="w-1/2 h-4 bg-slate-200 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
