import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * HeroSectionSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton precisely matching
 * the geometry and spacing of the HeroSection campaign banner.
 */
export function HeroSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-emerald-50/70 via-slate-50/40 via-45% to-white border-b border-slate-200/60 py-12 sm:py-16 lg:py-20">
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center animate-pulse">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            <div className="w-64 h-7 bg-slate-200 rounded-full mx-auto lg:mx-0" />

            <div className="space-y-3">
              <div className="w-4/5 h-10 sm:h-14 bg-slate-200 rounded-xl mx-auto lg:mx-0" />
              <div className="w-3/5 h-10 sm:h-14 bg-slate-200 rounded-xl mx-auto lg:mx-0" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <div className="w-full h-4 bg-slate-200 rounded-md" />
              <div className="w-5/6 h-4 bg-slate-200 rounded-md mx-auto lg:mx-0" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <div className="w-full sm:w-48 h-12 bg-slate-200 rounded-xl" />
              <div className="w-full sm:w-36 h-12 bg-slate-200 rounded-xl" />
            </div>

            <div className="pt-1 sm:pt-2 space-y-2">
              <div className="w-36 h-3 bg-slate-200 rounded-xs mx-auto lg:mx-0" />
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="w-24 h-7 bg-slate-200 rounded-lg" />
                <div className="w-28 h-7 bg-slate-200 rounded-lg" />
                <div className="w-24 h-7 bg-slate-200 rounded-lg" />
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6">
              <div className="w-28 h-4 bg-slate-200 rounded-md" />
              <div className="w-36 h-4 bg-slate-200 rounded-md" />
              <div className="w-36 h-4 bg-slate-200 rounded-md" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-xs"
              >
                <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-xl bg-slate-100 shrink-0" />
                <div className="min-w-0 flex-1 flex flex-col justify-between py-1 space-y-3">
                  <div>
                    <div className="w-20 h-4 bg-slate-200 rounded-full mb-2" />
                    <div className="w-4/5 h-4 sm:h-5 bg-slate-200 rounded-md" />
                    <div className="w-3/5 h-3 bg-slate-200 rounded-md mt-1.5" />
                  </div>
                  <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="w-16 h-4 bg-slate-200 rounded-md" />
                    <div className="w-14 h-4 bg-slate-200 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
