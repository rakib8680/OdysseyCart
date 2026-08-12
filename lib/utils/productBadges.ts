import { Product } from "@/lib/types/product";

export type ProductBadgeType = "new" | "bestseller" | "sale";

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

  // 1. Sale Badge (Highest Priority if discount exists)
  if (product.discount > 0) {
    badges.push({
      type: "sale",
      label: `-${product.discount}%`,
    });
  }

  // 2. New Badge (Created within last 30 days, with valid date guard)
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

  // 3. Bestseller Badge (Must have actual reviews + high rating density)
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
