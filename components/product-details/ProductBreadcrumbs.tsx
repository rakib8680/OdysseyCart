"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductBreadcrumbsProps {
  category: string;
  title: string;
  className?: string;
}

export function ProductBreadcrumbs({
  category,
  title,
  className,
}: ProductBreadcrumbsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/items");
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Product link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const categoryUrl = `/items?category=${encodeURIComponent(category.toLowerCase())}`;

  return (
    <nav
      aria-label="Breadcrumbs and product actions"
      className={cn(
        "flex items-center justify-between gap-3 mb-8 text-sm",
        className,
      )}
    >
      {/* Left: Back Button + Breadcrumbs Trail */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        {/* Smart History Back Button */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          title="Back to previous page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Trail */}
        <ol className="flex items-center gap-1.5 text-slate-500 min-w-0 overflow-hidden">
          <li className="shrink-0">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
          </li>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          <li className="shrink-0">
            <Link
              href="/items"
              className="hover:text-slate-900 transition-colors"
            >
              Items
            </Link>
          </li>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          <li className="shrink-0">
            <Link
              href={categoryUrl}
              className="font-medium text-slate-600 hover:text-emerald-600 transition-colors capitalize"
            >
              {category}
            </Link>
          </li>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline-block" />

          <li
            className="text-slate-900 font-semibold truncate hidden sm:inline-block max-w-45 md:max-w-65 lg:max-w-md"
            title={title}
          >
            {title}
          </li>
        </ol>
      </div>

      {/* Right: Quick Share / Copy Link */}
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 active:scale-95",
          copied
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 border border-slate-200/60 shadow-2xs",
        )}
        title="Share product link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Share</span>
          </>
        )}
      </button>
    </nav>
  );
}
