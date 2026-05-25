import { Skeleton } from "@/components/ui/skeleton";

export function ProductTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-50/50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-slate-200">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="px-8 py-5 flex items-center justify-between"
            >
              {/* Product Info (Img + Title) */}
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <Skeleton className="h-4 w-40" />
              </div>
              {/* Category */}
              <Skeleton className="h-4 w-24" />
              {/* Price */}
              <Skeleton className="h-4 w-16" />
              {/* Status */}
              <Skeleton className="h-6 w-24 rounded-full" />
              {/* Actions */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
