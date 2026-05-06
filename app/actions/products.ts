"use server";

import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";

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
    await connectDB();
    
    // Check RBAC
    await requireAdmin(data.createdBy);

    // check if product title already exists
    const existingProduct = await Product.findOne({ title: data.title });
    if (existingProduct) {
      return {
        success: false,
        error: "A product with this title already exists",
      };
    }

    await Product.create(data);

    revalidatePath("/items");
    revalidatePath("/items/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
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
