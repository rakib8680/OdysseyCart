import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Skeleton className="h-5 w-32 mb-5" />
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div>
              <Skeleton className="h-3.5 w-24 mb-1.5" />
              <Skeleton className="h-9 w-full max-w-sm" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <Skeleton className="h-5 w-24 mb-5" />
        <Skeleton className="h-4 w-72 mb-3" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 p-6">
        <Skeleton className="h-5 w-28 mb-3" />
        <Skeleton className="h-4 w-80 mb-4" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
