import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrderId(id: string) {
  return `#OD-${id.slice(-6).toUpperCase()}`;
}

export {
  formatDate,
  isValidDate,
  formatRelativeTime,
  type DateVariant,
  type FormatDateOptions,
} from "@/lib/utils/date";

/**
 * Resolves the application base URL for emails, SEO metadata, and callbacks.
 * Precedence: NEXT_PUBLIC_APP_URL -> VERCEL_PROJECT_PRODUCTION_URL -> VERCEL_URL -> localhost:3000
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Escapes regex special characters in a string for safe use in MongoDB $regex queries.
 * Prevents regex injection when using user-provided search input.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Converts a product title (or any text) into a URL-safe, SEO-friendly slug.
 * Used by Product schema pre-validate hook and server actions for DRY slug generation.
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

export { serializeOrder } from "@/lib/db/serialize";
export type { SerializedOrder } from "@/lib/types/order";
