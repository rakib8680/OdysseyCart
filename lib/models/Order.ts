import mongoose, { Document, Model, Schema } from "mongoose";

// ==========================================
// SHARED ORDER STATUS TYPE
// ==========================================
export type OrderStatus = "pending" | "paid" | "failed" | "shipped" | "delivered";

export interface TOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface TShippingInfo {
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface TOrder extends Document {
  userId: string; // Firebase UID
  stripePaymentId?: string; // Stripe PaymentIntent ID (pi_xxx)
  items: TOrderItem[];
  shippingInfo: TShippingInfo;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<TOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const ShippingInfoSchema = new Schema<TShippingInfo>(
  {
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema<TOrder>(
  {
    userId: { type: String, required: true },
    stripePaymentId: { type: String }, // Optional until payment is initiated
    items: { type: [OrderItemSchema], required: true },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Partial TTL Index: Automatically delete documents after 24 hours (86400 seconds)
// ONLY if their status is strictly "pending".
OrderSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { status: "pending" },
  },
);

const Order: Model<TOrder> =
  mongoose.models.Order || mongoose.model<TOrder>("Order", OrderSchema);

export default Order;
