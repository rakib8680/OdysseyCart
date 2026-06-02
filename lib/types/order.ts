// Shared serialized order type used across server actions and order components.
// This is the shape of an order AFTER serialization from Mongoose
// (ObjectIds → strings, Dates → ISO strings).

import { type CartItem } from "@/lib/types/cart";
import { type TShippingInfo, type OrderStatus } from "@/lib/models/Order";

export interface SerializedOrder {
  _id: string;
  userId: string;
  stripePaymentId?: string;
  items: CartItem[]; // Reuses CartItem — same shape (productId as string)
  shippingInfo: TShippingInfo; // Reuses TShippingInfo — already plain strings
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus; // Reuses shared OrderStatus type
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
