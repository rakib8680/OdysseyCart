// ==========================================
// SHARED CART UTILITIES
// ==========================================
// Used by both server actions (app/actions/cart.ts)
// and client hooks (hooks/cart/useCartActions.ts)

/** Generates a composite cart key for matching items by (productId + variantSku) */
export function cartItemKey(item: {
  productId: string;
  variantSku?: string;
}): string {
  return item.variantSku
    ? `${item.productId}:${item.variantSku}`
    : item.productId;
}

/** Finds the index of a cart item using composite key matching */
export function findCartIndex(
  items: { productId: string; variantSku?: string }[],
  input: { productId: string; variantSku?: string },
): number {
  const key = cartItemKey(input);
  return items.findIndex((i) => cartItemKey(i) === key);
}
