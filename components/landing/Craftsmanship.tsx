import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Craftsmanship() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side: Premium Modern Image */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1200&auto=format&fit=crop"
              alt="Premium product craftsmanship"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>

          {/* Right Side: The Story */}
          <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 lg:p-20 xl:p-24">
            <h2 className="text-sm font-bold tracking-[0.2em] text-emerald-600 uppercase mb-6">
              The Process
            </h2>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              Engineering <br />
              Without Compromise.
            </h3>

            <div className="space-y-6 text-lg text-slate-500 mb-12 max-w-lg">
              <p className="leading-relaxed">
                We don&apos;t believe in fast manufacturing or planned
                obsolescence. Every product that bears the Odyssey name is the
                result of hundreds of hours of obsessive prototyping and
                testing.
              </p>
              <p className="leading-relaxed">
                By working directly with world-class machinists and artisans, we
                strip away the traditional retail markup. The result?
                Heirloom-quality design that outlasts the trends.
              </p>
            </div>

            <div>
              <Link
                href="/items"
                className="group inline-flex items-center text-sm font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Discover the Collection
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
