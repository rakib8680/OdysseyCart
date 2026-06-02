import { Skeleton } from "@/components/ui/skeleton";

/** Loading skeleton for stat cards — matches StatCard dimensions */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
