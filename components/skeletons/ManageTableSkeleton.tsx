import { Skeleton } from "@/components/ui/skeleton";

export function ManageTableSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-slate-50/50 h-11 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-2 justify-end w-32 ml-auto">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
