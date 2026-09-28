export function HeroSectionSkeleton() {
  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 lg:py-20 overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-pulse">
          <div className="w-36 h-7 bg-slate-200 rounded-full" />
          <div className="space-y-3">
            <div className="w-3/4 h-12 sm:h-16 bg-slate-200 rounded-2xl" />
            <div className="w-2/3 h-12 sm:h-16 bg-slate-200 rounded-2xl" />
            <div className="w-1/2 h-12 sm:h-16 bg-slate-200 rounded-2xl" />
          </div>
          <div className="space-y-2 max-w-lg">
            <div className="w-full h-4 bg-slate-200 rounded-md" />
            <div className="w-5/6 h-4 bg-slate-200 rounded-md" />
            <div className="w-2/3 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="w-44 h-12 bg-slate-200 rounded-xl" />
            <div className="w-40 h-12 bg-slate-200 rounded-xl" />
          </div>
          <div className="flex gap-6 pt-4">
            <div className="w-28 h-5 bg-slate-200 rounded-md" />
            <div className="w-28 h-5 bg-slate-200 rounded-md" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-5 flex items-center justify-center animate-pulse">
          <div className="w-full aspect-4/3 sm:aspect-square max-w-lg bg-slate-200 rounded-3xl" />
        </div>
      </div>
    </section>
  );
}
