import { Skeleton } from "@/components/ui/skeleton";

function WishlistRowSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40 mb-1.5" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full hidden sm:block" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <div className="space-y-3">
      <WishlistRowSkeleton />
      <WishlistRowSkeleton />
      <WishlistRowSkeleton />
    </div>
  );
}
