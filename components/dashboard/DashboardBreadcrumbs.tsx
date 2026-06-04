"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SEGMENT_LABELS } from "@/lib/config/dashboard";

/**
 * Dynamic breadcrumb navigation for dashboard pages.
 * Automatically builds the trail from the current URL.
 *
 * Handles:
 * - Human-readable labels via SEGMENT_LABELS config
 * - MongoDB ObjectIds are hidden (shows parent label like "Edit" instead)
 * - Root dashboard pages (e.g., /account, /admin) show no breadcrumbs
 */
export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't render on root dashboard pages (e.g., /account or /admin)
  if (segments.length <= 1) return null;

  // Build the breadcrumb trail
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    // If this segment looks like a MongoDB ObjectId, skip it in the label
    // but keep the parent segment visible (e.g., "Edit" stays, ID is hidden)
    const isObjectId = /^[a-f0-9]{24}$/.test(segment);
    if (isObjectId) return null;

    const label = SEGMENT_LABELS[segment] || formatSegment(segment);

    return { label, href, isLast };
  });

  // Filter out null (ObjectId) entries
  const visibleCrumbs = crumbs.filter(Boolean) as {
    label: string;
    href: string;
    isLast: boolean;
  }[];

  // Recalculate "isLast" after filtering
  const finalCrumbs = visibleCrumbs.map((crumb, i) => ({
    ...crumb,
    isLast: i === visibleCrumbs.length - 1,
  }));

  if (finalCrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1.5 text-sm">
        {finalCrumbs.map((crumb) => (
          <li
            key={crumb.href}
            className="flex items-center gap-1.5  text-xs md:text-sm"
          >
            {!crumb.isLast ? (
              <>
                <Link
                  href={crumb.href}
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              </>
            ) : (
              <span className="text-slate-700 font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Fallback: capitalize and hyphen-split for unknown segments */
function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
