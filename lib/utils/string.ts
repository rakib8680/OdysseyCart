// ============================================================================
// STRING & REGEX UTILITIES (SSOT)
// ============================================================================

/**
 * Escapes regex special characters in a string for safe use in MongoDB $regex queries.
 * Prevents regex injection when using user-provided search input.
 *
 * @example
 * escapeRegex("iPhone 15 (Pro)") // "iPhone 15 \\(Pro\\)"
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Converts a product title (or any text) into a URL-safe, SEO-friendly slug.
 * Used by Product schema pre-validate hook and server actions for DRY slug generation.
 *
 * @example
 * slugify("Sony WH-1000XM5 Wireless Headphones!") // "sony-wh-1000xm5-wireless-headphones"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Strip invalid special characters
    .replace(/[\s_]+/g, "-") // Convert spaces & underscores to hyphens
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}
