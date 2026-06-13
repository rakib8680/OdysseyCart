"use server";

import { connectDB, serialize } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";
import { ProductValidationSchema } from "@/lib/validations/product";
import { SearchFiltersSchema } from "@/lib/validations/search";
import { PaginatedProducts } from "@/lib/types/product";

import { DB_SORT_MAP } from "@/lib/config/products";

import { requireAdmin } from "@/app/actions/users";

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
    revalidatePath("/admin/products");

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
      _id: { $ne: id },
    });

    if (titleConflict) {
      return {
        success: false,
        error: "Another product with this title already exists",
      };
    }

    // 3. Update using the clean, validated data
    // Zod does not include slug, which is good. The pre-save hook will NOT regenerate slug
    // automatically unless title changes, but Mongoose updateOne doesn't run pre-save hooks by default.
    // Instead we will use findByIdAndUpdate to just update fields, or find and save.

    // Mongoose findByIdAndUpdate is cleaner here. We'll manually update slug if title changed.
    const newSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await Product.findByIdAndUpdate(id, {
      ...validatedData,
      slug: newSlug,
    });

    revalidatePath("/items");
    revalidatePath("/admin/products");
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

    return serialize(products);
  } catch (error: any) {
    console.error("Error getting products:", error);
    return [];
  }
}

// ==========================================
// READ FILTERED + PAGINATED (for items page)
// ==========================================

// Only fetch fields that the ProductCard and AddToCartButton need
const LISTING_PROJECTION = {
  _id: 1,
  title: 1,
  slug: 1,
  shortDescription: 1,
  price: 1,
  category: 1,
  images: 1,
  stockQuantity: 1,
  discount: 1,
  brand: 1,
  averageRating: 1,
  numReviews: 1,
  createdAt: 1,
};

export async function getFilteredProducts(
  params: Record<string, string | number | undefined>,
): Promise<PaginatedProducts> {
  try {
    await connectDB();

    // 1. Validate & sanitize input
    const { search, category, minPrice, maxPrice, sort, page, limit } =
      SearchFiltersSchema.parse(params);

    // 2. Build MongoDB filter dynamically
    const filter: Record<string, any> = {};

    if (search) {
      // Escape regex special characters to prevent injection
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { shortDescription: { $regex: escaped, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // 3. Determine sort order
    const skip = (page - 1) * limit;
    const sortOrder = DB_SORT_MAP[sort] || DB_SORT_MAP.newest;

    // 4. Execute query + count in parallel for performance
    const [products, totalCount] = await Promise.all([
      Product.find(filter, LISTING_PROJECTION)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return {
      products: serialize(products),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error: any) {
    console.error("getFilteredProducts error:", error);
    return { products: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
}

// ==========================================
// READ CATEGORIES (for filter dropdown)
// ==========================================
export async function getCategories(): Promise<string[]> {
  try {
    await connectDB();
    const categories: string[] = await Product.distinct("category");
    return categories.sort();
  } catch (error: any) {
    console.error("getCategories error:", error);
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

    return serialize(product);
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

    return serialize(product);
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
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// READ FEATURED (for landing page)
// ==========================================
export async function getFeaturedProducts(limit = 3) {
  try {
    await connectDB();

    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return serialize(products);
  } catch (error: any) {
    console.error("Error getting featured products:", error);
    return [];
  }
}

// ==========================================
// READ RELATED (for product detail page)
// ==========================================
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = 3,
) {
  try {
    await connectDB();

    const products = await Product.find({
      category,
      _id: { $ne: excludeId },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return serialize(products);
  } catch (error: any) {
    console.error("Error getting related products:", error);
    return [];
  }
}
