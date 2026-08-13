import { useState, useCallback } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

/**
 * Lightweight hook for client-side image error recovery.
 * If a remote image URL returns a 404 or fails to load,
 * this silently swaps to the centralized fallback placeholder.
 * Includes infinite-loop protection to prevent re-triggering on fallback failure.
 */
export function useImageFallback(initialSrc: string) {
  const [src, setSrc] = useState(initialSrc);

  const onError = useCallback(() => {
    if (src !== FALLBACK_PRODUCT_IMAGE) {
      setSrc(FALLBACK_PRODUCT_IMAGE);
    }
  }, [src]);

  return { src, onError };
}
