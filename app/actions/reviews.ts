"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/app/actions/users";
import { ReviewValidationSchema } from "@/lib/validations/review";
import { revalidatePath } from "next/cache";
import { REVIEW_DB_SORT_MAP } from "@/lib/config/reviews";
import type {
  Review as ReviewType,
  PaginatedReviews,
  AdminReview,
} from "@/lib/types/review";

// ==========================================
// SERIALIZATION HELPER
// ==========================================

/**
 * Converts a Mongoose lean Review document into a plain JS object
 * safe for passing from Server Actions to Client Components.
 */
function serializeReview(doc: any): ReviewType {
  return {
    _id: doc._id.toString(),
    productId: doc.productId.toString(),
    userId: doc.userId,
    userName: doc.userName,
    rating: doc.rating,
    title: doc.title,
    body: doc.body,
    isVerifiedPurchase: doc.isVerifiedPurchase || false,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

// ==========================================
// RECALCULATE PRODUCT RATING (shared helper)
// ==========================================

/**
 * Atomically recalculates averageRating, numReviews, and ratingDistribution
 * on the Product document by aggregating all reviews for that product.
 * Called after both submitReview and deleteReview.
 */
async function recalculateProductRating(productId: string): Promise<void> {
  const objectId = new mongoose.Types.ObjectId(productId);

  // Run both aggregations in parallel for performance
  const [statsResult, distributionResult] = await Promise.all([
    // 1. Average rating + total count
    Review.aggregate([
      { $match: { productId: objectId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]),

    // 2. Count per rating bucket (1–5)
    Review.aggregate([
      { $match: { productId: objectId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
  ]);

  // Build distribution map — default all buckets to 0
  const distribution: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };
  distributionResult.forEach((d: { _id: number; count: number }) => {
    distribution[String(d._id)] = d.count;
  });

  const { averageRating = 0, numReviews = 0 } = statsResult[0] || {};

  // Atomic update — all three fields at once
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10, // 1 decimal place
    numReviews,
    ratingDistribution: distribution,
  });
}

// ==========================================
// GET PRODUCT REVIEWS (paginated + sortable)
// ==========================================

/**
 * Fetches paginated reviews for a product.
 * Public — no auth required.
 */
export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "newest",
): Promise<PaginatedReviews> {
  try {
    await connectDB();

    const objectId = new mongoose.Types.ObjectId(productId);
    const filter = { productId: objectId };
    const skip = (page - 1) * limit;
    const sortOrder = REVIEW_DB_SORT_MAP[sortBy as keyof typeof REVIEW_DB_SORT_MAP] || REVIEW_DB_SORT_MAP.newest;

    const [reviews, totalCount] = await Promise.all([
      Review.find(filter).sort(sortOrder).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);

    return {
      reviews: reviews.map(serializeReview),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error: any) {
    console.error("getProductReviews error:", error);
    return { reviews: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
}

// ==========================================
// CAN USER REVIEW (eligibility check)
// ==========================================

/**
 * Checks whether a user is eligible to review a product.
 * Requires: (1) a paid/shipped/delivered order containing the product
 *           (2) no existing review for this product
 */
export async function canUserReview(
  userId: string,
  productId: string,
): Promise<{
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
}> {
  try {
    await connectDB();

    if (!userId || !productId) {
      return { canReview: false, hasPurchased: false, hasReviewed: false };
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    // Run both checks in parallel
    const [hasPurchased, hasReviewed] = await Promise.all([
      Order.exists({
        userId,
        status: { $in: ["paid", "shipped", "delivered"] },
        "items.productId": objectId,
      }),
      Review.exists({ userId, productId: objectId }),
    ]);

    return {
      canReview: !!hasPurchased && !hasReviewed,
      hasPurchased: !!hasPurchased,
      hasReviewed: !!hasReviewed,
    };
  } catch (error: any) {
    console.error("canUserReview error:", error);
    return { canReview: false, hasPurchased: false, hasReviewed: false };
  }
}

// ==========================================
// SUBMIT REVIEW
// ==========================================

/**
 * Creates a new review for a product.
 * Re-verifies purchase server-side (don't trust client).
 * Recalculates product rating after insertion.
 */
export async function submitReview(data: Record<string, any>): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await connectDB();

    // 1. Validate input with Zod
    const validated = ReviewValidationSchema.parse(data);

    // 2. Re-verify purchase (server-side — never trust client)
    const objectId = new mongoose.Types.ObjectId(validated.productId);

    const hasPurchased = await Order.exists({
      userId: validated.userId,
      status: { $in: ["paid", "shipped", "delivered"] },
      "items.productId": objectId,
    });

    if (!hasPurchased) {
      return {
        success: false,
        error: "You must purchase this product before reviewing it.",
      };
    }

    // 3. Check for existing review (defensive — compound index also enforces this)
    const existingReview = await Review.exists({
      userId: validated.userId,
      productId: objectId,
    });

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this product.",
      };
    }

    // 4. Create the review
    await Review.create({
      productId: objectId,
      userId: validated.userId,
      userName: validated.userName,
      rating: validated.rating,
      title: validated.title,
      body: validated.body,
      isVerifiedPurchase: true, // Verified by step 2
    });

    // 5. Recalculate product rating (avg + count + distribution)
    await recalculateProductRating(validated.productId);

    // 6. Revalidate affected pages
    revalidatePath(`/items/${validated.productId}`);
    revalidatePath("/items");

    return { success: true };
  } catch (error: any) {
    // Handle duplicate key error from compound unique index
    if (error.code === 11000) {
      return {
        success: false,
        error: "You have already reviewed this product.",
      };
    }
    console.error("submitReview error:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// DELETE REVIEW (Admin only)
// ==========================================

/**
 * Deletes a review and recalculates the product's rating.
 * Admin-only action.
 */
export async function deleteReview(
  reviewId: string,
  adminUid: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    // 1. Find and delete the review in one atomic call
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return { success: false, error: "Review not found." };
    }

    const productId = review.productId.toString();

    // 2. Recalculate product rating
    await recalculateProductRating(productId);

    // 3. Revalidate affected pages
    revalidatePath(`/items/${productId}`);
    revalidatePath("/items");

    return { success: true };
  } catch (error: any) {
    console.error("deleteReview error:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// GET ALL REVIEWS — Admin Moderation
// ==========================================

/**
 * Fetches all reviews across all products for admin moderation.
 * Uses $lookup to include product title + slug.
 * Admin-only action.
 */
export async function getAllReviewsAdmin(adminUid: string): Promise<{
  success: boolean;
  reviews: AdminReview[];
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    const results = await Review.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { title: 1, slug: 1 } }],
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    ]);

    const reviews: AdminReview[] = results.map((doc: any) => ({
      ...serializeReview(doc),
      productTitle: doc.product?.title || "Deleted Product",
      productSlug: doc.product?.slug || "",
    }));

    return { success: true, reviews };
  } catch (error: any) {
    console.error("getAllReviewsAdmin error:", error);
    return { success: false, reviews: [], error: error.message };
  }
}
