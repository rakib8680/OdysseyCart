"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/product";
import { getProductImages } from "@/lib/utils/productImages";
import { useImageFallback } from "@/hooks/useImageFallback";
import { GalleryViewport } from "./GalleryViewport";
import { GalleryThumbnails } from "./GalleryThumbnails";
import { GalleryLightbox } from "./GalleryLightbox";

// ==========================================
// PROPS
// ==========================================
interface ProductGalleryProps {
  product: Product;
  activeImageIndex?: number; // Driven externally by VariantPicker
}

// ==========================================
// PRODUCT GALLERY COMPONENT (Orchestrator)
// ==========================================
export default function ProductGallery({
  product,
  activeImageIndex,
}: ProductGalleryProps) {
  const images = getProductImages(product.images);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { imgRef: mainImgRef, onError: onMainImageError } = useImageFallback();

  // Sync gallery when variant picker changes the active image
  useEffect(() => {
    if (activeImageIndex !== undefined && activeImageIndex < images.length) {
      setSelectedIndex(activeImageIndex);
    }
  }, [activeImageIndex, images.length]);

  return (
    <div className="lg:sticky lg:top-24">
      {/* 1. Main Viewport with GPU Hover-Zoom Lens & Image Counter */}
      <GalleryViewport
        src={images[selectedIndex]}
        alt={product.title}
        discount={product.discount}
        isFeatured={product.isFeatured}
        currentIndex={selectedIndex}
        totalImages={images.length}
        onOpenLightbox={() => setIsLightboxOpen(true)}
        onError={onMainImageError}
        imgRef={mainImgRef}
      />

      {/* 2. Thumbnails with Active Emerald Halo Ring */}
      <GalleryThumbnails
        images={images}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        alt={product.title}
      />

      {/* 3. Lightbox Modal — conditionally mounted to prevent DOM bloat */}
      {isLightboxOpen && (
        <GalleryLightbox
          images={images}
          initialIndex={selectedIndex}
          alt={product.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
