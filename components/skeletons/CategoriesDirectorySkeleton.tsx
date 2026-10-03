/**
 * CategoriesDirectorySkeleton Component
 *
 * Provides a zero-CLS Suspense streaming skeleton for the `/categories` directory route.
 * Mirrors the exact breadcrumb hierarchy, header badges, and responsive 3-column card grid.
 */
export function CategoriesDirectorySkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="app-container pt-8 sm:pt-10 pb-24 sm:pb-32">
        {/* 1. Header & Breadcrumb Skeleton */}
        <div className="max-w-3xl mb-10 sm:mb-12 space-y-4 animate-pulse">
          {/* Breadcrumb */}
          <div className="w-40 h-4 bg-slate-200 rounded-md" />

          {/* Pill Badge */}
          <div className="w-36 h-6 bg-slate-200 rounded-full" />

          {/* Title */}
          <div className="w-72 sm:w-96 h-10 sm:h-12 bg-slate-200 rounded-xl" />

          {/* Subtitle */}
          <div className="w-full sm:w-4/5 h-5 bg-slate-200 rounded-md" />
        </div>

        {/* 2. Responsive 6-Card Category Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-16/10 sm:aspect-4/3 rounded-2xl bg-slate-200/80 animate-pulse border border-slate-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
