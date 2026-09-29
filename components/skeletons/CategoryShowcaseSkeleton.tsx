import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * CategoryShowcaseSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for CategoryShowcase.
 */
export function CategoryShowcaseSkeleton() {
  return (
    <section className={`bg-white border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 lg:mb-14 gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="w-48 sm:w-64 h-8 sm:h-10 bg-slate-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="w-20 h-5 bg-slate-200 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-full aspect-4/3 md:aspect-3/4 ${HOMEPAGE_TOKENS.cardRadius} bg-slate-200 animate-pulse`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
