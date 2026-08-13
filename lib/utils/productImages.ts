import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

/**
 * Resolves a safe, non-empty product image URL from the images array.
 * Handles null, undefined, empty arrays, and empty string entries.
 */
export function getProductImageUrl(images?: string[]): string {
  const src = images?.[0]?.trim();
  return src && src.length > 0 ? src : FALLBACK_PRODUCT_IMAGE;
}

/**
 * Resolves a full image array, guaranteeing at least one valid entry.
 * Filters out empty/whitespace-only strings and falls back to placeholder if none remain.
 */
export function getProductImages(images?: string[]): string[] {
  if (!images || images.length === 0) return [FALLBACK_PRODUCT_IMAGE];

  const validImages = images.filter((img) => img.trim().length > 0);
  return validImages.length > 0 ? validImages : [FALLBACK_PRODUCT_IMAGE];
}
