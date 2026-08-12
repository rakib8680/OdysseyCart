import { Product, Variant } from "@/lib/types/product";

export interface ColorSwatchItem {
  name: string;
  hex: string;
  imageIndex?: number;
  variant: Variant;
}

/**
 * Color name to hex mapping for clean visual representation.
 */
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#eab308",
  purple: "#a855f7",
  pink: "#ec4899",
  gray: "#6b7280",
  grey: "#6b7280",
  silver: "#cbd5e1",
  gold: "#eab308",
  brown: "#78350f",
  orange: "#f97316",
  navy: "#1e3a8a",
  beige: "#f5f5dc",
  charcoal: "#374151",
};

/**
 * Resolves a hex code from a color string, supporting multi-word colors (e.g. "Space Gray", "Midnight Blue").
 */
function resolveColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();

  // 1. Direct exact match
  if (COLOR_HEX_MAP[normalized]) {
    return COLOR_HEX_MAP[normalized];
  }

  // 2. Keyword fallback match inside multi-word color names
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (normalized.includes(key)) {
      return hex;
    }
  }

  // 3. Fallback slate hex
  return "#94a3b8";
}

/**
 * Parses variants of a product to extract unique color swatches with hex codes and image indexes.
 * Serves as the single source of truth for color swatch processing across grid, list, and detail views.
 */
export function extractVariantColorSwatches(product: Product): ColorSwatchItem[] {
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

          colorSwatches.push({
            name: colorName,
            hex,
            imageIndex: variant.imageIndex,
            variant,
          });
        }
      }
    }
  }

  return colorSwatches;
}
