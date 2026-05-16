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
  const tax = parseFloat((discountedSubtotal * TAX_RATE).toFixed(2));
  const total = parseFloat(
    (discountedSubtotal + shippingCost + tax).toFixed(2),
  );

  return { subtotal, shippingCost, tax, discount, total };
}
