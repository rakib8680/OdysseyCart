import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * HeroSectionSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton precisely matching
 * the geometry and spacing of the HeroSection campaign banner.
 */
export function HeroSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-200/60 py-12 sm:py-16 lg:py-20">
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center animate-pulse">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            <div className="w-56 h-6 bg-slate-200 rounded-full mx-auto lg:mx-0" />

            <div className="space-y-3">
              <div className="w-4/5 h-10 sm:h-14 bg-slate-200 rounded-xl mx-auto lg:mx-0" />
              <div className="w-3/5 h-10 sm:h-14 bg-slate-200 rounded-xl mx-auto lg:mx-0" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <div className="w-full h-4 bg-slate-200 rounded-md" />
              <div className="w-5/6 h-4 bg-slate-200 rounded-md mx-auto lg:mx-0" />
              <div className="w-2/3 h-4 bg-slate-200 rounded-md mx-auto lg:mx-0" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <div className="w-full sm:w-44 h-12 bg-slate-200 rounded-xl" />
              <div className="w-full sm:w-40 h-12 bg-slate-200 rounded-xl" />
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6">
              <div className="w-32 h-4 bg-slate-200 rounded-md" />
              <div className="w-32 h-4 bg-slate-200 rounded-md" />
              <div className="w-32 h-4 bg-slate-200 rounded-md" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-72 sm:h-64 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2 h-full bg-slate-100 rounded-xl" />
              <div className="w-full sm:w-1/2 flex flex-col justify-between py-2 space-y-4">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-slate-200 rounded-md" />
                  <div className="w-full h-6 bg-slate-200 rounded-md" />
                  <div className="w-3/4 h-3 bg-slate-200 rounded-md" />
                </div>
                <div className="w-20 h-6 bg-slate-200 rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-3 h-16 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-12 h-2.5 bg-slate-200 rounded-xs" />
                    <div className="w-16 h-3 bg-slate-200 rounded-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
