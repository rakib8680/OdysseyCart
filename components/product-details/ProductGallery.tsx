"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Product } from "@/lib/types/product";

// ==========================================
// CONSTANTS
// ==========================================
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

// ==========================================
// PROPS
// ==========================================
interface ProductGalleryProps {
  product: Product;
  activeImageIndex?: number; // Driven externally by VariantPicker
}

// ==========================================
// PRODUCT GALLERY COMPONENT
// ==========================================
export default function ProductGallery({
  product,
  activeImageIndex,
}: ProductGalleryProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync gallery when variant picker changes the active image
  useEffect(() => {
    if (activeImageIndex !== undefined && activeImageIndex < images.length) {
      setSelectedIndex(activeImageIndex);
    }
  }, [activeImageIndex, images.length]);

  const hasDiscount = product.discount > 0;

  return (
    <div className="lg:sticky lg:top-24">
      {/* Main Image Viewport */}
      <div
        className="w-full aspect-square bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center p-8 relative group/gallery cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
            -{product.discount}% OFF
          </div>
        )}
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </div>
        )}
        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10">
          <ZoomIn className="w-3.5 h-3.5" />
          Click to zoom
        </div>
        <img
          src={images[selectedIndex]}
          alt={product.title}
          className="w-full h-full object-contain rounded-xl mix-blend-multiply max-h-125 transition-opacity duration-300"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.slice(0, 4).map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`aspect-square bg-slate-50 rounded-xl border overflow-hidden p-2 transition-all cursor-pointer ${
                selectedIndex === i
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={img}
                alt={`${product.title} - ${i + 1}`}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal — conditionally mounted to prevent DOM bloat */}
      {isLightboxOpen && (
        <LightboxModal
          images={images}
          initialIndex={selectedIndex}
          alt={product.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// LIGHTBOX MODAL (Conditionally Mounted)
// ==========================================
interface LightboxModalProps {
  images: string[];
  initialIndex: number;
  alt: string;
  onClose: () => void;
}

function LightboxModal({
  images,
  initialIndex,
  alt,
  onClose,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
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
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2 rounded-full hover:bg-white/10"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white/70 text-sm font-medium z-50">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Full-Res Image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === i
                  ? "border-emerald-500 ring-2 ring-emerald-500/30"
                  : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
