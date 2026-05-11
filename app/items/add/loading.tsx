import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAddProduct() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 min-h-screen">
      {/* Page heading */}
      <Skeleton className="h-9 w-56 mb-2" />
      <Skeleton className="h-5 w-80 mb-10" />

      {/* Two-column form skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column cards */}
        <div className="space-y-10">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <Skeleton className="h-7 w-48 mb-4" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <Skeleton className="h-7 w-24 mb-4" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Right column cards */}
        <div className="space-y-10">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <Skeleton className="h-7 w-56 mb-4" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4 pt-6 mt-10">
        <Skeleton className="h-12 w-28 rounded-xl" />
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>
    </div>
  );
}
