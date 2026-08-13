import { useRef, useEffect, useCallback } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

/**
 * Bulletproof image fallback hook.
 *
 * Handles TWO failure scenarios:
 * 1. **Pre-hydration failure** (hard reload): The browser loads the `<img>` from server HTML
 *    and the image 404s BEFORE React hydrates and attaches `onError`. We catch this with
 *    a `useEffect` that checks `img.complete && img.naturalWidth === 0` after mount.
 * 2. **Post-hydration failure** (client navigation): Standard `onError` handler swaps the src.
 *
 * Uses a `data-fallback` attribute as an infinite-loop guard instead of URL string comparison
 * to avoid browser URL encoding mismatches.
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
      !img.dataset.fallbackApplied
    ) {
      img.dataset.fallbackApplied = "true";
      img.src = FALLBACK_PRODUCT_IMAGE;
    }
  }, []);

  // Standard onError for images that fail after hydration is complete
  const onError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (!target.dataset.fallbackApplied) {
        target.dataset.fallbackApplied = "true";
        target.src = FALLBACK_PRODUCT_IMAGE;
      }
    },
    [],
  );

  return { imgRef, onError };
}
