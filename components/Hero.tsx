import Link from "next/link";

export function Hero() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-128px)] flex items-center justify-center p-8 lg:p-24 overflow-hidden bg-slate-50">
        {/* Geometric Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full border border-emerald-100 opacity-50 hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full border border-slate-200 opacity-50 hidden lg:block"></div>
        <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] border border-slate-100 opacity-40 transform rotate-45 -translate-y-1/2 z-0"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 relative">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold uppercase tracking-wider border border-emerald-100">
              New Collection Available
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Precision <br />
              <span className="text-emerald-600">Engineered</span> <br />
              for Modern Life.
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
              Discover our curated collection of premium tech, minimalist
              furniture, and everyday carry essentials designed for those who
              appreciate Geometric Balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/items"
                className="px-8 py-4 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-emerald-900/10 hover:shadow-emerald-600/30"
              >
                <span>Shop Collection</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-lg text-sm font-bold hover:border-slate-900 transition-colors flex items-center justify-center"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Visual Presentation */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center">
            {/* Real Product Card Representation */}
            <div className="w-[85%] h-[85%] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col group hover:border-emerald-200 transition-colors duration-500 z-10 overflow-hidden relative">
              {/* Product Image Region */}
              <div className="flex-1 w-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
                  alt="Chronos Smartwatch"
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Product Details Bar */}
              <div className="bg-white border-t border-slate-100 p-6 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Chronos Series 7
                  </h3>
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">
                    $299.00 USD
                  </p>
                </div>

                {/* Add to Cart / Shopping Bag Icon */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                  <svg
                    className="w-4 h-4 transform group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">
                  Top Seller
                </span>
              </div>
              <div className="absolute top-8 right-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase [writing-mode:vertical-rl] transform rotate-180">
                Premium Series
              </div>
            </div>

            {/* Decorative background blocks */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[90%] border border-slate-200 rounded-3xl transform rotate-6 -z-10 bg-slate-100/50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-full bg-slate-200/50 rounded-3xl transform -rotate-3 -z-20"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
