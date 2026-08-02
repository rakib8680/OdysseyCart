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

import type { SerializedOrder } from "@/lib/types/order";

/**
 * Converts a Mongoose lean Order document into a plain JS object
 * safe for passing from Server Actions to Client Components.
 * Maps ObjectIds to strings and Dates to ISO strings.
 */
export function serializeOrder(doc: any): SerializedOrder {
  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    stripePaymentId: doc.stripePaymentId || undefined,
    items: (doc.items || []).map((item: any) => ({
      productId: item.productId.toString(),
      title: item.title,
      price: item.price,
      image: item.image || "",
      quantity: item.quantity,
    })),
    shippingInfo: {
      email: doc.shippingInfo.email,
      fullName: doc.shippingInfo.fullName,
      address: doc.shippingInfo.address,
      city: doc.shippingInfo.city,
      state: doc.shippingInfo.state,
      zipCode: doc.shippingInfo.zipCode,
      country: doc.shippingInfo.country,
      phone: doc.shippingInfo.phone,
    },
    subtotal: doc.subtotal,
    tax: doc.tax,
    shippingCost: doc.shippingCost,
    discount: doc.discount || 0,
    couponCode: doc.couponCode || undefined,
    total: doc.total,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

