import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Interface for TypeScript
export interface TProduct extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  images: string[];
  stockQuantity: number;
  averageRating: number;
  numReviews: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const ProductSchema = new Schema<TProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    stockQuantity: { type: Number, required: true, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    createdBy: { type: String, required: true }, // Firebase UID
  },
  {
    timestamps: true,
  },
);

// 3. Auto-generate slug from title before saving
ProductSchema.pre("validate", function (next: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
      .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
  }
  next();
});

// 4. Create and export the model safely for Next.js
const Product: Model<TProduct> =
  mongoose.models.Product || mongoose.model<TProduct>("Product", ProductSchema);
export default Product;
