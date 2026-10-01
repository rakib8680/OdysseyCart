import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * TestimonialsSkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for Testimonials.
 */
export function TestimonialsSkeleton() {
  return (
    <section className={`bg-white border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding} overflow-hidden`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3 animate-pulse">
          <div className="w-64 sm:w-80 h-8 sm:h-10 bg-slate-200 rounded-xl mx-auto" />
          <div className="w-80 sm:w-96 h-4 bg-slate-200 rounded-md mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 border border-slate-200/80 flex flex-col justify-between animate-pulse"
            >
              <div>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                  <div className="w-16 sm:w-24 h-3 sm:h-4 bg-slate-200 rounded-md" />
                  <div className="w-12 xs:w-16 sm:w-20 h-4 sm:h-5 bg-slate-200 rounded-full" />
                </div>
                <div className="w-3/4 h-3.5 sm:h-5 bg-slate-200 rounded-md mt-2 sm:mt-4 mb-2" />
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-6">
                  <div className="w-full h-2.5 sm:h-3.5 bg-slate-200 rounded-md" />
                  <div className="w-5/6 h-2.5 sm:h-3.5 bg-slate-200 rounded-md" />
                  <div className="w-2/3 h-2.5 sm:h-3.5 bg-slate-200 rounded-md" />
                </div>
              </div>

              <div>
                <div className="pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <div className="w-14 sm:w-20 h-3 sm:h-4 bg-slate-200 rounded-md" />
                    <div className="w-10 sm:w-16 h-2 sm:h-3 bg-slate-200 rounded-md" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="w-16 sm:w-28 h-2.5 sm:h-3 bg-slate-200 rounded-md" />
                  <div className="w-6 sm:w-12 h-2.5 sm:h-3 bg-slate-200 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
