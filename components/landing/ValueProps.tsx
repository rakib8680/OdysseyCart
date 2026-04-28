import { ShieldCheck, Leaf, Zap, Plane } from "lucide-react";

export function ValueProps() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            The Odyssey Standard
          </h2>
          <p className="text-lg text-slate-500">
            Uncompromising quality in every detail. We&apos;ve completely
            rethought how premium gear should be delivered.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Bento Box 1: Large Horizontal Focus */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative z-10 max-w-md">
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 transition-colors duration-500 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:border-emerald-100">
                <ShieldCheck className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Unconditional Lifetime Warranty
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Every product we sell is backed by our promise. If it breaks,
                tears, or falters, we replace it. No questions asked.
              </p>
            </div>
            {/* Massive decorative background icon */}
            <ShieldCheck
              className="absolute -bottom-12 -right-12 w-80 h-80 text-slate-50 group-hover:text-emerald-500/10 group-hover:scale-110 transition-all duration-700"
              strokeWidth={0.5}
            />
          </div>

          {/* Bento Box 2: Square Vertical Focus */}
          <div className="bg-white rounded-[2rem] p-10 flex flex-col relative overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 transition-colors duration-500 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:border-emerald-100">
                <Plane className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Global Express
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Free overnight shipping to over 40 countries on all premium
                orders.
              </p>
            </div>
            <Plane
              className="absolute -bottom-8 -right-8 w-56 h-56 text-slate-50 group-hover:text-emerald-500/10 group-hover:-translate-y-4 group-hover:translate-x-4 transition-all duration-700"
              strokeWidth={0.5}
            />
          </div>

          {/* Bento Box 3: Square Vertical Focus */}
          <div className="bg-white rounded-[2rem] p-10 flex flex-col relative overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 transition-colors duration-500 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:border-emerald-100">
                <Zap className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Same-day dispatch means your gear arrives when you actually need
                it.
              </p>
            </div>
            <Zap
              className="absolute -bottom-8 -right-8 w-56 h-56 text-slate-50 group-hover:text-emerald-500/10 group-hover:scale-110 transition-all duration-700"
              strokeWidth={0.5}
            />
          </div>

          {/* Bento Box 4: Large Horizontal Focus */}
          <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative z-10 max-w-md">
              <div className="w-14 h-14 bg-slate-800/50 group-hover:bg-emerald-900/40 transition-colors duration-500 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 group-hover:border-emerald-800">
                <Leaf className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                100% Carbon Neutral
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Beautiful design shouldn&apos;t cost the earth. Every shipment
                is fully offset, utilizing biodegradable packaging.
              </p>
            </div>
            <Leaf
              className="absolute -bottom-12 -right-12 w-80 h-80 text-slate-800/50 group-hover:text-emerald-500/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700"
              strokeWidth={0.5}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
