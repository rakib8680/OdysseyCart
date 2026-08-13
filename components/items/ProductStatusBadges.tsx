import { getProductBadges, ProductBadgeInfo } from "@/lib/utils/productBadges";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface ProductStatusBadgesProps {
  product: Product;
  className?: string;
}

/**
 * Reusable Product Status Badges Overlay.
 * Renders "Sale", "New", "Bestseller", "Low Stock", and "Out of Stock" badges cleanly on product card images.
 */
export function ProductStatusBadges({ product, className }: ProductStatusBadgesProps) {
  const badges: ProductBadgeInfo[] = getProductBadges(product);

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1 items-center z-10 pointer-events-none", className)}>
      {badges.map((badge) => {
        if (badge.type === "out_of_stock") {
          return (
            <span
              key={badge.type}
              className="bg-slate-900 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs"
            >
              {badge.label}
            </span>
          );
        }

        if (badge.type === "low_stock") {
          return (
            <span
              key={badge.type}
              className="bg-amber-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs inline-flex items-center gap-0.5"
            >
              <Zap className="w-3 h-3 text-white fill-white shrink-0" />
              <span>{badge.label}</span>
            </span>
          );
        }

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
