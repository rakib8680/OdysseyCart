import { CartItem } from "@/lib/types/cart";

// ==========================================
// SHARED PRICING CONSTANTS
// ==========================================
export const SHIPPING_THRESHOLD = 1000;
export const SHIPPING_COST = 50;
export const TAX_RATE = 0.05; // 5%

// ==========================================
// ORDER TOTALS CALCULATOR
// ==========================================
export interface OrderTotals {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}

/**
 * Calculates order totals from cart items.
 * Single source of truth — used by OrderSummary (display),
 * server actions (PaymentIntent), and anywhere else that needs pricing.
 *
 * @param items - Array of cart items with price and quantity
 * @param discount - Optional discount amount (for future coupon system)
 */
export function calculateOrderTotals(
  items: Pick<CartItem, "price" | "quantity">[],
  discount: number = 0,
): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shippingCost =
    discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat(
    (discountedSubtotal + shippingCost + tax).toFixed(2),
  );

  return { subtotal, shippingCost, tax, discount, total };
}

// ==========================================
// CURRENCY & DISCOUNT SSOT HELPERS
// ==========================================

/**
 * Universal Currency Formatter (SSOT).
 * Formats a numerical amount into a standardized USD currency string with
 * locale-aware thousands separators (e.g. 1299.99 → "$1,299.99", 0 → "$0.00").
 *
 * @param amount - The numerical amount to format (handles undefined, null, NaN safely)
 * @param options - Optional formatting overrides (e.g. showCents: false for whole dollar figures)
 * @returns Formatted currency string, guaranteed to never return NaN or crash
 */
export function formatPrice(
  amount: number | null | undefined,
  options?: { showCents?: boolean },
): string {
  const value = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: options?.showCents === false ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Single Source of Truth for discounted price calculation.
 * Clamps discount strictly between 0% and 100% and returns clean rounded price.
 *
 * @param price - Base unit price
 * @param discount - Discount percentage (0-100)
 * @returns Net unit price after discount
 */
export function calculateDiscountedPrice(
  price: number,
  discount: number = 0,
): number {
  if (!discount || discount <= 0) return price;
  const safeDiscount = Math.min(100, Math.max(0, discount));
  return parseFloat((price * (1 - safeDiscount / 100)).toFixed(2));
}

/**
 * Calculates exact dollar savings from an original price and discount percentage.
 *
 * @param price - Base unit price
 * @param discount - Discount percentage (0-100)
 * @returns Dollar amount saved
 */
export function calculateDiscountSavings(
  price: number,
  discount: number = 0,
): number {
  if (!discount || discount <= 0) return 0;
  return parseFloat(
    (price - calculateDiscountedPrice(price, discount)).toFixed(2),
  );
}
