import { Skeleton } from "@/components/ui/skeleton";
import { AdminRoute } from "@/components/AdminRoute";

export default function LoadingManageItems() {
  return (
    <AdminRoute>
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/5" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 py-2">
              <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-8 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </AdminRoute>
  );
}
