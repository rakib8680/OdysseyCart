"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable card wrapper for all analytics charts.
 * Provides consistent styling (title, subtitle, padding, loading overlay).
 * Matches StatCard's visual language (rounded-2xl, border, white bg).
 */
export function ChartCard({
  title,
  subtitle,
  loading = false,
  className,
  children,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
