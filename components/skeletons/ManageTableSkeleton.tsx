import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ManageTableSkeletonProps {
  /** When true, renders matching page header and search toolbar skeletons (for streaming loading.tsx) */
  showHeader?: boolean;
  /** Number of skeleton rows to display. Defaults to 5 */
  rowCount?: number;
}

/**
 * Unified Admin Product Table Skeleton (SSOT).
 * Perfectly mirrors ManageTable column widths, padding, and layout
 * to guarantee zero cumulative layout shift (CLS = 0).
 */
export function ManageTableSkeleton({
  showHeader = false,
  rowCount = 5,
}: ManageTableSkeletonProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <>
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>

          {/* Search & Filter Toolbar Skeleton */}
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-9 sm:h-10 w-full max-w-sm rounded-lg" />
          </div>
        </>
      )}

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 font-semibold text-slate-500 pl-8 w-20">
                  <Skeleton className="h-4 w-10" />
                </TableHead>
                <TableHead className="h-11 font-semibold text-slate-500 pl-8">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="h-11 font-semibold text-slate-500">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="h-11 font-semibold text-slate-500">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="h-11 font-semibold text-slate-500">
                  <Skeleton className="h-4 w-14" />
                </TableHead>
                <TableHead className="h-11 font-semibold text-slate-500 text-right pr-8">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i}>
                  {/* Thumbnail */}
                  <TableCell className="pl-8 py-4">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                  </TableCell>
                  {/* Title */}
                  <TableCell className="py-4 pl-8">
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  {/* Category */}
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  {/* Price */}
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* Status Badge */}
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  {/* Action Buttons */}
                  <TableCell className="py-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
