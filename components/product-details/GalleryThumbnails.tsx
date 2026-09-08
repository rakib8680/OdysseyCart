"use client";

import { cn } from "@/lib/utils";
import { handleImageError } from "@/hooks/useImageFallback";

interface GalleryThumbnailsProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  alt: string;
}

/**
 * GalleryThumbnails Component.
 * Horizontal scrollable thumbnail track with active emerald halo ring,
 * keyboard accessibility (role="tablist"), and image error fallback.
 */
export function GalleryThumbnails({
  images,
  selectedIndex,
  onSelect,
  alt,
}: GalleryThumbnailsProps) {
  if (images.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Product image thumbnails"
      className="flex items-center gap-3 mt-3 overflow-x-auto p-1.5 scrollbar-none"
    >
      {images.map((img: string, i: number) => {
        const isSelected = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`View image ${i + 1} of ${images.length}`}
            onClick={() => onSelect(i)}
            className={cn(
              "w-20 h-20 shrink-0 aspect-square bg-slate-50 rounded-2xl overflow-hidden p-2 transition-all cursor-pointer select-none border-2",
              isSelected
                ? "border-emerald-500 ring-2 ring-emerald-500/25 shadow-xs"
                : "border-slate-200/80 hover:border-slate-300 opacity-70 hover:opacity-100",
            )}
          >
            <img
              src={img}
              alt={`${alt} thumbnail ${i + 1}`}
              onError={handleImageError}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </button>
        );
      })}
    </div>
  );
}
