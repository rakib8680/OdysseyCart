import { useRef, useEffect, useCallback } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

/**
 * Bulletproof image fallback hook for single/main images.
 *
 * Handles TWO failure scenarios:
 * 1. **Pre-hydration failure** (hard reload): The browser loads the `<img>` from server HTML
 *    and the image 404s BEFORE React hydrates and attaches `onError`. Caught via `useEffect`
 *    checking `img.complete && img.naturalWidth === 0` after mount.
 * 2. **Post-hydration failure** (client navigation / image switching): Standard `onError`
 *    handler swaps the src.
 *
 * Uses URL comparison as the infinite-loop guard so it works correctly when
 * React reuses the same `<img>` element with a different `src` (e.g. gallery switching).
 */
export function useImageFallback() {
  const imgRef = useRef<HTMLImageElement>(null);

  // Post-hydration check: detect images that already failed before React attached onError
  useEffect(() => {
    const img = imgRef.current;
    if (
      img &&
      img.complete &&
      img.naturalWidth === 0 &&
      img.src !== FALLBACK_PRODUCT_IMAGE
    ) {
      img.src = FALLBACK_PRODUCT_IMAGE;
    }
  }, []);

  // Standard onError for images that fail after hydration
  const onError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.src !== FALLBACK_PRODUCT_IMAGE) {
        target.src = FALLBACK_PRODUCT_IMAGE;
      }
    },
    [],
  );

  return { imgRef, onError };
}

/**
 * Standalone onError handler for `<img>` tags in `.map()` loops where a ref can't be attached.
 * (e.g. gallery thumbnails, lightbox thumbnails)
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_PRODUCT_IMAGE) {
    target.src = FALLBACK_PRODUCT_IMAGE;
  }
}
