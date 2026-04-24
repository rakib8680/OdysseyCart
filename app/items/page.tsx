export const metadata = {
  title: 'Products | OdysseyCart',
};

export default function ItemsPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Collection</h1>
          <p className="text-slate-500">Explore our premium selection.</p>
        </div>
        
        {/* Placeholder: Search and Filters */}
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full md:w-64 h-12 px-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <select className="h-12 px-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-600">
            <option>All Categories</option>
          </select>
        </div>
      </div>

      {/* Placeholder: Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group cursor-pointer">
            <div className="w-full aspect-square bg-slate-100 rounded-2xl border border-slate-200 mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Loading Product...</h3>
            <p className="text-sm text-slate-500 mb-3">Fetching details</p>
            <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
