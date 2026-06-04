"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

/** Reusable empty/placeholder state — used across dashboard pages */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
        {description}
      </p>

      {/* Render a button if onClick is provided, otherwise render a link */}
      {actionLabel && actionOnClick ? (
        <button
          onClick={actionOnClick}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      ) : actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
