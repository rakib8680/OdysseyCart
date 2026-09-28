export function TestimonialsSkeleton() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-pulse">
          <div className="w-36 h-6 bg-slate-200 rounded-full mx-auto" />
          <div className="w-72 sm:w-96 h-10 bg-slate-200 rounded-xl mx-auto" />
          <div className="w-full h-4 bg-slate-200 rounded-md mx-auto" />
        </div>

        {/* 3-Card Grid Skeleton */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
