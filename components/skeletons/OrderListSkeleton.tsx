import { Skeleton } from "@/components/ui/skeleton";

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="w-[200px] flex-shrink-0 sm:block hidden">
        <Skeleton className="h-4 w-20 mb-1.5" />
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="w-full sm:hidden">
        <Skeleton className="h-4 w-20 mb-1.5" />
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        <div className="flex -space-x-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-12 ml-2 hidden md:block" />
      </div>
      <div className="min-w-[110px]">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="min-w-[90px]">
        <Skeleton className="h-4 w-16" />
      </div>
      <div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div className="space-y-5">
      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Card skeletons */}
      <div className="grid gap-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}
