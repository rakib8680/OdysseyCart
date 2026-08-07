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
