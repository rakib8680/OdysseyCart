import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Interface for TypeScript
export interface TCartItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface TCart extends Document {
  userId: string; // Firebase UID
  items: TCartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Cart Item Sub-Schema
const CartItemSchema = new Schema<TCartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

// 3. Cart Schema — one cart per user
const CartSchema = new Schema<TCart>(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

// 4. Create and export the model safely for Next.js
const Cart: Model<TCart> =
  mongoose.models.Cart || mongoose.model<TCart>("Cart", CartSchema);

export default Cart;
