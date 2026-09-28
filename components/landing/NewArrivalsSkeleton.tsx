export function NewArrivalsSkeleton() {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-slate-50/60 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4 animate-pulse">
          <div className="space-y-3">
            <div className="w-28 h-6 bg-slate-200 rounded-full" />
            <div className="w-56 h-10 bg-slate-200 rounded-xl" />
            <div className="w-80 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <div className="w-28 h-6 bg-slate-200 rounded-md" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Carousel Row Skeleton */}
        <div className="flex gap-3 sm:gap-6 overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-52.5 xs:w-56.25 sm:w-67.5 md:w-75 lg:w-82.5 xl:w-87.5 shrink-0 bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-4 space-y-2 sm:space-y-4 animate-pulse"
            >
              <div className="w-full aspect-4/3 sm:aspect-square bg-slate-200 rounded-xl" />
              <div className="w-1/3 h-2.5 sm:h-3.5 bg-slate-200 rounded-md" />
              <div className="w-3/4 h-4 sm:h-6 bg-slate-200 rounded-md" />
              <div className="w-1/2 h-3.5 sm:h-5 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
