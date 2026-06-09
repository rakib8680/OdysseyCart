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
  brand: string;
  tags: string[];
  specs: Map<string, string>;
  discount: number;
  isFeatured: boolean;
  warranty: string;
  shippingInfo: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

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
    brand: { type: String, default: "" },
    tags: { type: [String], default: [] },
    specs: { type: Map, of: String, default: {} },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    isFeatured: { type: Boolean, default: false },
    warranty: { type: String, default: "" },
    shippingInfo: { type: String, default: "Free Standard Shipping" },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// 3. Auto-generate slug from title before saving
ProductSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
      .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
  }
});

// 4. Indexes for search & filtering performance
ProductSchema.index(
  { title: "text", shortDescription: "text" },
  { weights: { title: 10, shortDescription: 5 }, name: "product_text_search" },
);
ProductSchema.index({ category: 1, price: 1 });

// 5. Create and export the model safely for Next.js
const Product: Model<TProduct> =
  mongoose.models.Product || mongoose.model<TProduct>("Product", ProductSchema);
export default Product;
