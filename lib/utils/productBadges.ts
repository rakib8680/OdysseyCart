import { Product } from "@/lib/types/product";

export type ProductBadgeType =
  | "out_of_stock"
  | "low_stock"
  | "sale"
  | "new"
  | "bestseller";

export interface ProductBadgeInfo {
  type: ProductBadgeType;
  label: string;
}

/**
 * Evaluates product metadata to resolve active status badges.
 * Single source of truth for card badge calculations across grid, list, and quick-view modals.
 */
export function getProductBadges(product: Product): ProductBadgeInfo[] {
  const badges: ProductBadgeInfo[] = [];

  // 1. Stock Status Badges (Highest Priority)
  if (product.stockQuantity === 0) {
    badges.push({
      type: "out_of_stock",
      label: "Out of Stock",
    });
  } else if (product.stockQuantity > 0 && product.stockQuantity <= 3) {
    badges.push({
      type: "low_stock",
      label: `Only ${product.stockQuantity} left`,
    });
  }

  // 2. Sale Badge (If discount exists)
  if (product.discount > 0) {
    badges.push({
      type: "sale",
      label: `-${product.discount}%`,
    });
  }

  // 3. New Badge (Created within last 30 days, with valid date guard)
  if (product.createdAt) {
    const createdDate = new Date(product.createdAt).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (!isNaN(createdDate) && createdDate >= thirtyDaysAgo) {
      badges.push({
        type: "new",
        label: "New",
      });
    }
  }

  // 4. Bestseller Badge (Must have actual reviews + high rating density)
  const numReviews = product.numReviews || 0;
  const averageRating = product.averageRating || 0;

  if (numReviews >= 30 || (numReviews >= 5 && averageRating >= 4.5)) {
    badges.push({
      type: "bestseller",
      label: "Bestseller",
    });
  }

  return badges;
}
