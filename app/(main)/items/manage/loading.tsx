import { Skeleton } from "@/components/ui/skeleton";
import { AdminRoute } from "@/components/AdminRoute";

export default function LoadingManageItems() {
  return (
    <AdminRoute>
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Table header — hidden on mobile, just like the real table */}
          <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-slate-100">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Rows */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border-b last:border-b-0 border-slate-50 px-6 py-4"
            >
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3.5 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>

              {/* Mobile row — stacked card style */}
              <div className="md:hidden space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-3.5 w-1/2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-14" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminRoute>
  );
}
