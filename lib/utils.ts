import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Shadcn/Tailwind class merging utility (SSOT).
 * Combines conditional classnames (clsx) with Tailwind conflict resolution (twMerge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// MODULAR UTILITY RE-EXPORTS (FOR SEAMLESS BACKWARD COMPATIBILITY)
// ============================================================================
export { formatOrderId } from "@/lib/utils/order";
export { getBaseUrl } from "@/lib/utils/url";
export { escapeRegex, slugify } from "@/lib/utils/string";
export {
  formatDate,
  isValidDate,
  formatRelativeTime,
  type DateVariant,
  type FormatDateOptions,
} from "@/lib/utils/date";
export { serializeOrder } from "@/lib/db/serialize";
export type { SerializedOrder } from "@/lib/types/order";
