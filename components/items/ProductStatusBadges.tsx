import { getProductBadges, ProductBadgeInfo } from "@/lib/utils/productBadges";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface ProductStatusBadgesProps {
  product: Product;
  className?: string;
}

/**
 * Reusable Product Status Badges Overlay.
 * Renders "Sale", "New", and "Bestseller" badges cleanly on product card images.
 */
export function ProductStatusBadges({ product, className }: ProductStatusBadgesProps) {
  const badges: ProductBadgeInfo[] = getProductBadges(product);

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1 items-center z-10 pointer-events-none", className)}>
      {badges.map((badge) => {
        if (badge.type === "sale") {
          return (
            <span
              key={badge.type}
              className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs"
            >
              {badge.label}
            </span>
          );
        }

        if (badge.type === "new") {
          return (
            <span
              key={badge.type}
              className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs"
            >
              {badge.label}
            </span>
          );
        }

        if (badge.type === "bestseller") {
          return (
            <span
              key={badge.type}
              className="bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs"
            >
              ★ {badge.label}
            </span>
          );
        }

        return null;
      })}
    </div>
  );
}
