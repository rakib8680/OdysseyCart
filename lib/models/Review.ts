import mongoose, { Document, Model, Schema } from "mongoose";

// ==========================================
// REVIEW INTERFACE
// ==========================================
export interface TReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: string; // Firebase UID
  userName: string; // Denormalized — avoids $lookup per review render
  rating: number; // 1–5
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// REVIEW SCHEMA
// ==========================================
const ReviewSchema = new Schema<TReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    body: { type: String, required: true, maxlength: 1000 },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ==========================================
// INDEXES
// ==========================================

// One review per user per product (DB-level enforcement)
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Paginated newest-first queries for a product
ReviewSchema.index({ productId: 1, createdAt: -1 });

// ==========================================
// MODEL EXPORT
// ==========================================
const Review: Model<TReview> =
  mongoose.models.Review || mongoose.model<TReview>("Review", ReviewSchema);

export default Review;
