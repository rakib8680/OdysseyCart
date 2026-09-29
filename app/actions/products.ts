"use server";

import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";
import { ProductValidationSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/app/actions/users";

// ============================================================================
// BACKWARD COMPATIBILITY RE-EXPORTS (DATA ACCESS LAYER)
// Pure read operations now reside in @/lib/data/products (Data Access Layer).
// Re-exported here so existing call sites remain functional without breakage.
// ============================================================================
export {
  LISTING_PROJECTION,
  getProductListings,
  getNewArrivals,
  getOnSaleProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getBestSellers,
  getHeroProduct,
  getProductBySlug,
  getProductById,
  getCategories,
  getFilteredProducts,
  getCategoryShowcaseData,
} from "@/lib/data/products";

// ============================================================================
// SLUG COLLISION GUARD
// ============================================================================
/**
 * Generates a unique slug for a product, appending an incremental suffix
 * (e.g. "-2", "-3") if a collision exists. Excludes `currentId` during updates
 * so a product's own slug doesn't trigger a false collision.
 */
async function generateUniqueSlug(
  title: string,
  currentId?: string,
): Promise<string> {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await Product.findOne({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    }).lean();

    if (!existing) break;
    count++;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
}

// ============================================================================
// MUTATIONS (SERVER ACTIONS)
// ============================================================================

/**
 * Creates a new product in the database.
 * Requires admin authentication. Revalidates catalog and management paths.
 */
export async function createProduct(data: Record<string, any>) {
  try {
    // 1. Validate data structure with Zod
    const validatedData = ProductValidationSchema.parse(data);

    await connectDB();

    // 2. Check RBAC using the validated UID
    await requireAdmin(validatedData.createdBy);

    // 3. Check if product title already exists
    const existingProduct = await Product.findOne({
      title: validatedData.title,
    });
    if (existingProduct) {
      return {
        success: false,
        error: "A product with this title already exists",
      };
    }

    // 4. Create using the clean, validated data
    await Product.create(validatedData);

    revalidatePath("/items");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates an existing product and regenerates unique slug if title changed.
 * Requires admin authentication. Revalidates catalog, management, and item paths.
 */
export async function updateProduct(id: string, data: Record<string, any>) {
  try {
    // 1. Validate data structure with Zod
    const validatedData = ProductValidationSchema.parse(data);

    await connectDB();

    // 2. Check RBAC using the validated UID
    await requireAdmin(validatedData.createdBy);

    // 3. Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    // 4. Check if title is taken by ANOTHER product
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

    // 5. Generate collision-safe slug & update using the clean, validated data
    const newSlug = await generateUniqueSlug(validatedData.title, id);

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

/**
 * Deletes a product by ID.
 * Requires admin authentication. Revalidates catalog and management paths.
 */
export async function deleteProduct(id: string, uid: string) {
  try {
    await connectDB();

    // 1. Check RBAC
    await requireAdmin(uid);

    // 2. Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // 3. Delete the product
    await Product.findByIdAndDelete(id);

    revalidatePath("/items");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
