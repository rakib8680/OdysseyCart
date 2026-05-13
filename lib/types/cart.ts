// Shared cart types used across all components.
// These are the shapes AFTER serialization from Mongoose
// (via JSON.parse(JSON.stringify())).

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
