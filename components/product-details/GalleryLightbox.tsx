"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { handleImageError } from "@/hooks/useImageFallback";

interface GalleryLightboxProps {
  images: string[];
  initialIndex: number;
  alt: string;
  onClose: () => void;
}

/**
 * GalleryLightbox Component.
 * Fullscreen modal image viewer with keyboard navigation (Esc, Arrow keys),
 * touch-friendly chevrons, image counter, and thumbnail navigation strip.
 */
export function GalleryLightbox({
  images,
  initialIndex,
  alt,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery fullscreen view"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center animate-in fade-in-0 duration-200 select-none"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-50 p-2.5 rounded-full hover:bg-white/10 cursor-pointer"
        aria-label="Close fullscreen gallery"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter Pill */}
      {images.length > 1 && (
        <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full z-50 pointer-events-none">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev / Next Navigation Chevrons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Large Image Viewport */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - Full view ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[78vh] object-contain select-none transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
        onError={handleImageError}
      />

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50 max-w-[90vw] overflow-x-auto pb-1 scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === i
                  ? "border-emerald-500 ring-2 ring-emerald-500/40 scale-105 shadow-md"
                  : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
              }`}
              aria-label={`Jump to image ${i + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
