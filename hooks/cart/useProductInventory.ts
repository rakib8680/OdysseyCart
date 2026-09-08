import { useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product, Variant } from "@/lib/types/product";
import { cartItemKey } from "@/lib/utils/cart";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

import { ProductInventoryState } from "@/lib/types/cart";

// Re-export for convenience and backward compatibility
export type { ProductInventoryState };

// ==========================================
// HOOK: useProductInventory
// Single Source of Truth (SSOT) for product
// pricing, warehouse stock, and live cart bounds.
// ==========================================
export function useProductInventory(
  product: Product,
  selectedVariant?: Variant | null,
): ProductInventoryState {
  const { items, busyItems } = useCart();

  return useMemo(() => {
    const hasVariants = Boolean(product.variants && product.variants.length > 0);
    const needsVariantSelection = hasVariants && !selectedVariant;

    // 1. Resolve Pricing
    const hasDiscount = product.discount > 0;
    const basePrice = selectedVariant?.price ?? product.price;
    const unitPrice = hasDiscount
      ? basePrice * (1 - product.discount / 100)
      : basePrice;

    // 2. Resolve Stock & Identification
    const totalStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
    const itemKey = cartItemKey({
      productId: product._id,
      variantSku: selectedVariant?.sku,
    });

    // 3. Match against Cart State (SSOT lookup)
    const cartItem = items.find((i) => cartItemKey(i) === itemKey);
    const inCart = cartItem?.quantity ?? 0;

    // 4. Compute Constraints & Availability
    const availableToAdd = Math.max(0, totalStock - inCart);
    const isOutOfStock = totalStock <= 0;
    const isMaxInCart = totalStock > 0 && inCart >= totalStock;
    const isBusy = busyItems.has(itemKey);

    // 5. Resolve Visual Asset
    const resolvedImage =
      selectedVariant?.imageIndex !== undefined
        ? product.images?.[selectedVariant.imageIndex] ||
          product.images?.[0] ||
          FALLBACK_PRODUCT_IMAGE
        : product.images?.[0] || FALLBACK_PRODUCT_IMAGE;

    return {
      itemKey,
      totalStock,
      inCart,
      availableToAdd,
      isOutOfStock,
      isMaxInCart,
      isBusy,
      needsVariantSelection,
      basePrice,
      unitPrice,
      hasDiscount,
      resolvedImage,
    };
  }, [product, selectedVariant, items, busyItems]);
}
