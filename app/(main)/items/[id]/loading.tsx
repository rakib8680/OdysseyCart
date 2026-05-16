import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProductDetail() {
  return (
    <div className="container max-w-6xl mx-auto px-4 md:px-8 py-16">
      {/* Back link */}
      <Skeleton className="h-5 w-36 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery skeleton */}
        <div className="sticky top-24">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          {/* Category + Brand */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title */}
          <Skeleton className="h-12 w-4/5" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Key Information grid */}
          <div className="border-y border-slate-100 py-6 space-y-3">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Specs table */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 mb-3" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>

          {/* Add to cart button */}
          <Skeleton className="w-full h-14 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
