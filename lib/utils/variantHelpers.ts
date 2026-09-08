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
