import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrderId(id: string) {
  return `#OD-${id.slice(-6).toUpperCase()}`;
}

/**
 * Escapes regex special characters in a string for safe use in MongoDB $regex queries.
 * Prevents regex injection when using user-provided search input.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
