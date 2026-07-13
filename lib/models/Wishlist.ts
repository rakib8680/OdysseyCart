import mongoose, { Document, Model, Schema } from "mongoose";

// ==========================================
// WISHLIST INTERFACE
// ==========================================
export interface TWishlist extends Document {
  userId: string; // Firebase UID
  products: mongoose.Types.ObjectId[]; // Array of product references
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// WISHLIST SCHEMA — one wishlist per user
// ==========================================
const WishlistSchema = new Schema<TWishlist>(
  {
    userId: { type: String, required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

// ==========================================
// MODEL EXPORT
// ==========================================
const Wishlist: Model<TWishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<TWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
