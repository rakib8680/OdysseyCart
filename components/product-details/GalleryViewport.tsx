"use client";

import { useState, useRef } from "react";
import { Star, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryViewportProps {
  src: string;
  alt: string;
  discount?: number;
  isFeatured?: boolean;
  currentIndex: number;
  totalImages: number;
  onOpenLightbox: () => void;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  imgRef?: React.RefObject<HTMLImageElement | null>;
}

/**
 * GalleryViewport Component.
 * Renders the primary product image viewport with 60fps GPU hover-zoom lens,
 * image counter pill, discount badge, and fullscreen lightbox trigger.
 */
export function GalleryViewport({
  src,
  alt,
  discount = 0,
  isFeatured = false,
  currentIndex,
  totalImages,
  onOpenLightbox,
  onError,
  imgRef,
}: GalleryViewportProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Computes cursor position percentage for hardware-accelerated CSS transform-origin
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomOrigin({ x, y });
  };

  const hasDiscount = discount > 0;

  return (
    <div
      ref={containerRef}
      className="w-full aspect-square bg-slate-50/80 rounded-3xl border border-slate-200/80 overflow-hidden flex items-center justify-center p-6 sm:p-8 relative group/gallery cursor-zoom-in select-none shadow-xs"
      onClick={onOpenLightbox}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      aria-label="Product image viewer. Click to enlarge full screen."
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-xs z-10 pointer-events-none">
          -{discount}% OFF
        </div>
      )}

      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs z-10 pointer-events-none">
          <Star className="w-3 h-3 fill-white" />
          Featured
        </div>
      )}

      {/* Image Counter Pill (e.g. 1 / 4) */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 z-10 pointer-events-none shadow-xs">
          <span>{currentIndex + 1}</span>
          <span className="text-white/60">/</span>
          <span>{totalImages}</span>
        </div>
      )}

      {/* Zoom Hint / Fullscreen Trigger Badge */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10 pointer-events-none shadow-xs">
        <ZoomIn className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Click to enlarge</span>
      </div>

      {/* Main Product Image with GPU-accelerated Zoom */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onError={onError}
        style={{
          transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
          transform: isZoomed ? "scale(1.8)" : "scale(1)",
        }}
        className={cn(
          "w-full h-full object-contain rounded-xl mix-blend-multiply max-h-125 transition-transform ease-out will-change-transform",
          isZoomed ? "duration-100 cursor-crosshair" : "duration-300",
        )}
      />
    </div>
  );
}
