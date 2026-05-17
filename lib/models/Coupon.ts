import mongoose, { Document, Model, Schema } from "mongoose";

export interface TCoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
  minimumPurchaseAmount?: number;
  maximumDiscountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<TCoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Automatically converts "summer20" to "SUMMER20"
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumPurchaseAmount: {
      type: Number,
      min: 0,
    },
    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true },
);

// Next.js hot-reload guard
const Coupon: Model<TCoupon> =
  mongoose.models.Coupon || mongoose.model<TCoupon>("Coupon", CouponSchema);

export default Coupon;
