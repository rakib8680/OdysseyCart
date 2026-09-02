"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// PROPS INTERFACE
// ==========================================
interface BackButtonProps {
  /** Optional fallback URL if no browser history exists (e.g. direct link landing) */
  fallbackHref?: string;
  /** Label text for the back button */
  label?: string;
  /** Optional custom CSS class overrides */
  className?: string;
}

/**
 * Smart Back Button Component (Industry Standard).
 * Leverages client-side router history (`router.back()`) to preserve active
 * catalog state (page numbers, active filters, search queries & sort order).
 * Falls back to `fallbackHref` if opened directly from external links/search engines.
 */
export function BackButton({
  fallbackHref = "/items",
  label = "Back to Collection",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // If user navigated from within the app, go back in history to preserve exact URL params
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors cursor-pointer group",
        className,
      )}
    >
      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
}
