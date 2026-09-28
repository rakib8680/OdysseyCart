export function NewArrivalsSkeleton() {
  return (
    <section className="py-20 sm:py-24 bg-slate-50/60 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 animate-pulse">
          <div className="space-y-3">
            <div className="w-28 h-6 bg-slate-200 rounded-full" />
            <div className="w-56 h-10 bg-slate-200 rounded-xl" />
            <div className="w-80 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-8 bg-slate-200 rounded-lg" />
            <div className="w-9 h-9 bg-slate-200 rounded-full" />
            <div className="w-9 h-9 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Carousel Row Skeleton */}
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-67.5 sm:w-77.5 shrink-0 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 animate-pulse"
            >
              <div className="w-full aspect-square bg-slate-200 rounded-xl" />
              <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
              <div className="w-1/2 h-4 bg-slate-200 rounded-md" />
              <div className="w-full h-9 bg-slate-200 rounded-lg mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
