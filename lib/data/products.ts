import { cache } from "react";
import mongoose from "mongoose";
import { connectDB, serialize } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { SearchFiltersSchema } from "@/lib/validations/search";
import { escapeRegex } from "@/lib/utils";
import type { Product as ProductType, PaginatedProducts } from "@/lib/types/product";
import {
  DB_SORT_MAP,
  PRODUCT_CATEGORIES,
  type CategoryShowcaseItem,
} from "@/lib/config/products";

/**
 * Single Source of Truth (SSOT) for product listing card projections.
 * Restricts queries to the exact fields required for card and catalog rendering,
 * preventing memory bloat and unnecessary transfer of full descriptions or raw specs.
 */
export const LISTING_PROJECTION = {
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
  options: 1,
  variants: 1,
} as const;

export interface ProductListingOptions {
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
}

// ============================================================================
// 1. UNIVERSAL DRY QUERY RUNNER
// ============================================================================

/**
 * Universal query runner for product catalog listings and landing carousels.
 * Eliminates duplicate connection, error handling, and serialization boilerplate.
 */
export async function getProductListings(
  options: ProductListingOptions = {},
): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.find(
      options.filter || {},
      LISTING_PROJECTION,
    )
      .sort(options.sort || { createdAt: -1, _id: -1 })
      .limit(options.limit ?? 8)
      .lean();

    return serialize(products) as ProductType[];
  } catch (error) {
    console.error("getProductListings error:", error);
    return [];
  }
}

// ============================================================================
// 2. DOMAIN PRESETS (CONSUMING DRY QUERY RUNNER)
// ============================================================================

/** Fetches newest product drops sorted chronologically. */
export async function getNewArrivals(limit = 8): Promise<ProductType[]> {
  return getProductListings({
    sort: { createdAt: -1, _id: -1 },
    limit,
  });
}

/** Fetches products with active discounts, sorted by discount percentage descending. */
export async function getOnSaleProducts(limit = 6): Promise<ProductType[]> {
  return getProductListings({
    filter: { discount: { $gt: 0 } },
    sort: { discount: -1, averageRating: -1, createdAt: -1, _id: -1 },
    limit,
  });
}

/** Fetches flagship featured products. */
export async function getFeaturedProducts(limit = 3): Promise<ProductType[]> {
  return getProductListings({
    filter: { isFeatured: true },
    sort: { createdAt: -1, _id: -1 },
    limit,
  });
}

/** Fetches related products within the same category, excluding the active product. */
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = 3,
): Promise<ProductType[]> {
  const filter: Record<string, unknown> = { category };
  if (mongoose.Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
  } else {
    filter._id = { $ne: excludeId };
  }

  return getProductListings({
    filter,
    sort: { createdAt: -1, _id: -1 },
    limit,
  });
}

// ============================================================================
// 3. SPECIALIZED DATA ACCESS QUERIES
// ============================================================================

/**
 * Fetches best sellers sorted by popularity score (numReviews * averageRating).
 * Uses MongoDB aggregation pipeline for high performance sorting before projection.
 */
export async function getBestSellers(limit = 8): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.aggregate([
      {
        $addFields: {
          popularityScore: {
            $multiply: [
              { $ifNull: ["$averageRating", 0] },
              { $ifNull: ["$numReviews", 0] },
            ],
          },
        },
      },
      {
        $sort: {
          popularityScore: -1,
          numReviews: -1,
          averageRating: -1,
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: LISTING_PROJECTION,
      },
    ]);

    return serialize(products) as ProductType[];
  } catch (error) {
    console.error("getBestSellers error:", error);
    return [];
  }
}

/**
 * Fetches the flagship product for the hero showcase.
 * Prioritizes active featured products with highest rating; falls back to top-rated.
 */
export async function getHeroProduct(): Promise<ProductType | null> {
  try {
    await connectDB();

    let product = await Product.findOne(
      { isFeatured: true },
      LISTING_PROJECTION,
    )
      .sort({ averageRating: -1, createdAt: -1, _id: -1 })
      .lean();

    if (!product) {
      product = await Product.findOne({}, LISTING_PROJECTION)
        .sort({ averageRating: -1, createdAt: -1, _id: -1 })
        .lean();
    }

    return product ? (serialize(product) as ProductType) : null;
  } catch (error) {
    console.error("getHeroProduct error:", error);
    return null;
  }
}

/**
 * Fetches a single product by its unique URL slug.
 */
export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return serialize(product) as ProductType;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

/**
 * Fetches a single product by its MongoDB ObjectId.
 */
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return serialize(product) as ProductType;
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
}

/**
 * Reads all unique product categories sorted alphabetically.
 * Wrapped in React cache() to deduplicate identical calls within a single request lifecycle.
 */
export const getCategories = cache(async (): Promise<string[]> => {
  try {
    await connectDB();
    const categories: string[] = await Product.distinct("category");
    return categories.sort();
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
});

/**
 * Executes a deterministic filtered and paginated query for the items catalog and admin list.
 */
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
      const escaped = escapeRegex(search);
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { shortDescription: { $regex: escaped, $options: "i" } },
      ];
    }

    if (category) {
      const categories = await getCategories();
      const canonical = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase(),
      );
      filter.category = canonical || category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // 3. Determine sort order
    const sortOrder = DB_SORT_MAP[sort] || DB_SORT_MAP.newest;

    // 4. Count matching documents first for bounds checking & early exit
    const totalCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    if (totalCount === 0) {
      return {
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
      };
    }

    // 5. Clamp page strictly within bounds [1, totalPages]
    const safePage = Math.max(1, Math.min(page, totalPages));
    const skip = (safePage - 1) * limit;

    // 6. Execute deterministic paginated query
    const products = await Product.find(filter, LISTING_PROJECTION)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      products: serialize(products) as ProductType[],
      totalCount,
      totalPages,
      currentPage: safePage,
    };
  } catch (error) {
    console.error("getFilteredProducts error:", error);
    return { products: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
}

/**
 * Reads category showcase card data, strictly sourced from PRODUCT_CATEGORIES SSOT.
 */
export async function getCategoryShowcaseData(): Promise<CategoryShowcaseItem[]> {
  try {
    await connectDB();

    const results = await Promise.all(
      PRODUCT_CATEGORIES.map(async (cat) => {
        const regex = new RegExp(`^${escapeRegex(cat.name)}$`, "i");
        const [count, sampleProduct] = await Promise.all([
          Product.countDocuments({ category: regex }),
          Product.findOne(
            { category: regex },
            { images: 1, isFeatured: 1, averageRating: 1 },
          )
            .sort({ isFeatured: -1, averageRating: -1, createdAt: -1, _id: -1 })
            .lean(),
        ]);

        return {
          ...cat,
          itemCount: count,
          featuredImage:
            sampleProduct?.images && sampleProduct.images.length > 0
              ? sampleProduct.images[0]
              : null,
        };
      }),
    );

    return results;
  } catch (error) {
    console.error("Error getting category showcase data:", error);
    return PRODUCT_CATEGORIES.map((cat) => ({
      ...cat,
      itemCount: 0,
      featuredImage: null,
    }));
  }
}
