"use server";

import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for product validation
const ProductValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(200, "Short description is too long"),
  fullDescription: z.string().min(1, "Full description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  stockQuantity: z.coerce
    .number()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  createdBy: z.string().min(1, "Creator ID is required"),
  brand: z.string().default(""),
  tags: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  discount: z.coerce.number().min(0).max(100).default(0),
  isFeatured: z.coerce.boolean().default(false),
  warranty: z.string().default(""),
  shippingInfo: z.string().default("Free Standard Shipping"),
  weight: z.coerce.number().min(0).default(0),
  dimensions: z
    .object({
      length: z.coerce.number().min(0).default(0),
      width: z.coerce.number().min(0).default(0),
      height: z.coerce.number().min(0).default(0),
    })
    .default({ length: 0, width: 0, height: 0 }),
});

// Helper function to enforce admin role
async function requireAdmin(uid?: string) {
  if (!uid) throw new Error("Unauthorized: No user ID provided");
  const user = await User.findOne({ firebaseUid: uid });
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }
}

// ==========================================
// CREATE
// ==========================================
export async function createProduct(data: Record<string, any>) {
  try {
    // 1. Validate data structure with Zod
    const validatedData = ProductValidationSchema.parse(data);

    await connectDB();

    // 2. Check RBAC using the validated UID
    await requireAdmin(validatedData.createdBy);

    // check if product title already exists
    const existingProduct = await Product.findOne({
      title: validatedData.title,
    });
    if (existingProduct) {
      return {
        success: false,
        error: "A product with this title already exists",
      };
    }

    // 3. Create using the clean, validated data
    await Product.create(validatedData);

    revalidatePath("/items");
    revalidatePath("/items/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// UPDATE
// ==========================================
export async function updateProduct(id: string, data: Record<string, any>) {
  try {
    // 1. Validate data structure with Zod
    const validatedData = ProductValidationSchema.parse(data);

    await connectDB();
    
    // 2. Check RBAC using the validated UID
    await requireAdmin(validatedData.createdBy);

    // check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    // check if title is taken by ANOTHER product
    const titleConflict = await Product.findOne({
      title: validatedData.title,
      _id: { $ne: id }
    });
    
    if (titleConflict) {
      return { success: false, error: "Another product with this title already exists" };
    }

    // 3. Update using the clean, validated data
    // Zod does not include slug, which is good. The pre-save hook will NOT regenerate slug 
    // automatically unless title changes, but Mongoose updateOne doesn't run pre-save hooks by default.
    // Instead we will use findByIdAndUpdate to just update fields, or find and save.
    
    // Mongoose findByIdAndUpdate is cleaner here. We'll manually update slug if title changed.
    const newSlug = validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    await Product.findByIdAndUpdate(id, {
      ...validatedData,
      slug: newSlug
    });

    revalidatePath("/items");
    revalidatePath("/items/manage");
    revalidatePath(`/items/${newSlug}`);
    revalidatePath(`/items/${existingProduct.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// READ ALL
// ==========================================
export async function getProducts() {
  try {
    await connectDB();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.error("Error getting products:", error);
    return [];
  }
}

// ==========================================
// READ SINGLE (by slug or id)
// ==========================================
export async function getProductBySlug(slug: string) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const product = await Product.findById(id).lean();
    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    console.error("getProductById error:", error);
    return null;
  }
}

// ==========================================
// DELETE
// ==========================================
export async function deleteProduct(id: string, uid: string) {
  try {
    await connectDB();

    // Check RBAC
    await requireAdmin(uid);

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    revalidatePath("/items");
    revalidatePath("/items/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
