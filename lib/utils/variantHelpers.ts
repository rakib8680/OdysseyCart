import { Product, Variant } from "@/lib/types/product";

import {
  COLOR_HEX_MAP,
  getRelativeLuminance,
  isLightColor,
  resolveColorHex,
  resolveColorSwatch,
  ColorSwatchInfo,
} from "@/lib/utils/colors";

export {
  COLOR_HEX_MAP,
  getRelativeLuminance,
  isLightColor,
  resolveColorHex,
  resolveColorSwatch,
};
export type { ColorSwatchInfo };

export interface ColorSwatchItem {
  name: string;
  hex: string;
  swatch: ColorSwatchInfo;
  imageIndex?: number;
  variant: Variant;
}

/**
 * Parses variants of a product to extract unique color swatches with hex codes and image indexes.
 * Serves as the single source of truth for color swatch processing across grid, list, and detail views.
 */
export function extractVariantColorSwatches(
  product: Product,
): ColorSwatchItem[] {
  if (!product.variants || product.variants.length === 0) {
    return [];
  }

  const colorSwatches: ColorSwatchItem[] = [];
  const seenColorNames = new Set<string>();

  for (const variant of product.variants) {
    if (!variant.options) continue;

    // Search for option key containing "color", "shade", or "style"
    for (const [key, value] of Object.entries(variant.options)) {
      if (
        key.toLowerCase().includes("color") ||
        key.toLowerCase().includes("shade")
      ) {
        const colorName = value.trim();
        const normalizedKey = colorName.toLowerCase();

        if (!seenColorNames.has(normalizedKey)) {
          seenColorNames.add(normalizedKey);
          const hex = resolveColorHex(colorName);
          const swatch = resolveColorSwatch(colorName);

          colorSwatches.push({
            name: colorName,
            hex,
            swatch,
            imageIndex: variant.imageIndex,
            variant,
          });
        }
      }
    }
  }

  return colorSwatches;
}

/**
 * Resolves the optimal variant matching a target image index using a best-match reconciliation algorithm.
 *
 * Scoring algorithm:
 * 1. Filter all variants matching v.imageIndex === targetImageIndex.
 * 2. If no variants match (e.g. general lifestyle photo, diagram): returns null (no variant mutation).
 * 3. If exactly 1 variant matches: returns that variant.
 * 4. If multiple variants match:
 *    - Scores each candidate against currentSelections (number of matching option keys/values).
 *    - In-stock variants (stockQuantity > 0) receive a significant boost (+100).
 *    - Tie-breaker: candidate with highest score, or first matching in-stock variant.
 *
 * @param variants Product variants array
 * @param targetImageIndex The clicked thumbnail index
 * @param currentSelections The currently selected option dictionary (e.g. { "Case Color": "Space Black", "Strap": "Trail Loop" })
 * @returns The best matching Variant, or null if no variant corresponds to the image.
 */
export function resolveVariantFromImageIndex(
  variants: Variant[] | undefined,
  targetImageIndex: number,
  currentSelections?: Record<string, string> | null,
): Variant | null {
  if (!variants || variants.length === 0) return null;

  // 1. Find all candidates explicitly assigned to this imageIndex
  const candidates = variants.filter(
    (v) => typeof v.imageIndex === "number" && v.imageIndex === targetImageIndex,
  );

  if (candidates.length === 0) {
    return null; // Neutral / lifestyle / diagram image -> preserve current variant
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  // 2. Multi-match reconciliation: score candidates against current selections
  if (!currentSelections || Object.keys(currentSelections).length === 0) {
    return candidates.find((v) => v.stockQuantity > 0) || candidates[0];
  }

  let bestVariant = candidates[0];
  let highestScore = -1;

  for (const candidate of candidates) {
    let score = 0;

    // Favor in-stock candidates
    if (candidate.stockQuantity > 0) {
      score += 100;
    }

    // Reward option overlap with current user selections
    if (candidate.options) {
      for (const [key, val] of Object.entries(currentSelections)) {
        if (candidate.options[key] === val) {
          score += 10;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestVariant = candidate;
    }
  }

  return bestVariant;
}

