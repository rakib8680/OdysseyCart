export function CategoryShowcaseSkeleton() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 animate-pulse">
          <div className="space-y-3">
            <div className="w-32 h-6 bg-slate-200 rounded-full" />
            <div className="w-64 h-10 bg-slate-200 rounded-xl" />
            <div className="w-96 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="w-36 h-8 bg-slate-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-4/3 md:aspect-3/4 rounded-3xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
