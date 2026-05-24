import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrderId(id: string) {
  return `#OD-${id.slice(-6).toUpperCase()}`;
}
