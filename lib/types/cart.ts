// Shared cart types used across all components.
// These are the shapes AFTER serialization from Mongoose
// (via JSON.parse(JSON.stringify())).

export interface CartItem {
  productId: string;
  variantSku?: string; // Variant SKU for composite cart key
  selectedOptions?: Record<string, string>; // e.g. { Color: "Black", Size: "M" }
  title: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity?: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Input shape for adding items to cart (quantity is passed separately)
export type AddToCartInput = Omit<CartItem, "quantity">;

// Computed inventory and cart availability state (SSOT)
export interface ProductInventoryState {
  /** The composite cart key for this product/variant selection */
  itemKey: string;
  /** Total warehouse stock for this specific variant or base product */
  totalStock: number;
  /** Quantity of this item already held in the user's active cart */
  inCart: number;
  /** True remaining units the user can add: Math.max(0, totalStock - inCart) */
  availableToAdd: number;
  /** Whether the product/variant has 0 physical warehouse stock */
  isOutOfStock: boolean;
  /** Whether the user has already placed the maximum available stock into their cart */
  isMaxInCart: boolean;
  /** Whether this item is currently pending mutation (optimistic lock) */
  isBusy: boolean;
  /** Whether the product has variants configured but none is currently selected */
  needsVariantSelection: boolean;
  /** Original base unit price without discount */
  basePrice: number;
  /** Final calculated unit price with discount applied */
  unitPrice: number;
  /** True if product has an active discount percentage */
  hasDiscount: boolean;
  /** Resolved hero image for the selected variant (or fallback) */
  resolvedImage: string;
}
