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

/** Resolves price, stockQuantity, and image for a product + optional variant */
export function resolveVariantDetails(
  product: {
    price: number;
    stockQuantity: number;
    images?: string[];
    variants?: Array<{
      sku: string;
      price?: number;
      stockQuantity: number;
      imageIndex?: number;
    }>;
  },
  variantSku?: string
) {
  let price = product.price;
  let stockQuantity = product.stockQuantity;
  let image = product.images?.[0] || "";

  if (variantSku && product.variants && product.variants.length > 0) {
    const variant = product.variants.find((v) => v.sku === variantSku);
    if (variant) {
      if (variant.price !== undefined && variant.price !== null) {
        price = variant.price;
      }
      stockQuantity = variant.stockQuantity;
      if (
        variant.imageIndex !== undefined &&
        variant.imageIndex !== null &&
        product.images?.[variant.imageIndex]
      ) {
        image = product.images[variant.imageIndex];
      }
    }
  }

  return { price, stockQuantity, image };
}
