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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-slate-200 rounded-md" />
                <div className="w-20 h-5 bg-slate-200 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
              <div className="space-y-2">
                <div className="w-full h-3.5 bg-slate-200 rounded-md" />
                <div className="w-5/6 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-2/3 h-3.5 bg-slate-200 rounded-md" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="space-y-1">
                  <div className="w-20 h-4 bg-slate-200 rounded-md" />
                  <div className="w-16 h-3 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <div className="w-28 h-3 bg-slate-200 rounded-md" />
                <div className="w-12 h-3 bg-slate-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
