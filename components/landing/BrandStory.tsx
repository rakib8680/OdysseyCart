import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Award } from "lucide-react";

/**
 * BrandStory Component (Server Component)
 *
 * Modernized brand philosophy and craftsmanship storytelling section.
 * Replaces the static Craftsmanship component with high-density stat badges
 * and architectural narrative flow.
 */
export function BrandStory() {
  return (
    <section className="py-24 bg-slate-50/60 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side: Editorial Craftsmanship Photo */}
          <div className="relative w-full lg:w-1/2 min-h-95 lg:min-h-130 overflow-hidden bg-slate-100 group">
            <img
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1200&auto=format&fit=crop"
              alt="Odyssey architectural product craftsmanship"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Subtle Gradient & Badge */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-10">
              <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-xs border border-white/40">
                Heirloom Grade • Est. 2026
              </span>
            </div>
          </div>

          {/* Right Side: Philosophy & Value Counters */}
          <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 xl:p-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 mb-6 w-fit shadow-2xs">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Philosophy & Craft</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Engineering <br />
              <span className="text-emerald-600">Without Compromise.</span>
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              <p>
                We don&apos;t believe in fast manufacturing or planned
                obsolescence. Every product that bears the Odyssey name is the
                result of hundreds of hours of obsessive prototyping and
                structural stress-testing.
              </p>
              <p>
                By partnering directly with world-class machinists and artisans,
                we eliminate traditional middleman markups. The outcome is
                heirloom-caliber gear that outlasts transient trends.
              </p>
            </div>

            {/* 3 Value Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 mb-8">
              <div>
                <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-lg sm:text-2xl">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                  Carbon Offset Deliveries
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-lg sm:text-2xl">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>Lifetime</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                  Craft Guarantee
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-lg sm:text-2xl">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>Zero</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                  Retail Markup
                </p>
              </div>
            </div>

            {/* CTA Link */}
            <div>
              <Link
                href="/items"
                className="group inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>Discover the Full Collection</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
