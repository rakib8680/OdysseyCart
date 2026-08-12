import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

const iconSizes: Record<"xs" | "sm" | "md" | "lg", number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
};

/**
 * Reusable Star Rating Component.
 * Uses strict SVG dimensions to ensure star icons render at precise sizes without layout distortion.
 */
export function StarRating({
  rating,
  size = "md",
  showCount = false,
  count = 0,
  className,
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  const numericSize = iconSizes[size] || 14;

  return (
    <div className={cn("flex items-center gap-1 shrink-0", className)}>
      <div className="flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((star) => {
          if (roundedRating >= star) {
            return (
              <Star
                key={star}
                size={numericSize}
                className="fill-amber-400 text-amber-400 shrink-0"
              />
            );
          } else if (roundedRating === star - 0.5) {
            return (
              <StarHalf
                key={star}
                size={numericSize}
                className="fill-amber-400 text-amber-400 shrink-0"
              />
            );
          } else {
            return (
              <Star
                key={star}
                size={numericSize}
                className="text-slate-300 dark:text-slate-700 shrink-0"
              />
            );
          }
        })}
      </div>
      {showCount && (
        <span
          className={cn(
            size === "xs"
              ? "text-[10px]"
              : size === "sm"
              ? "text-xs"
              : "text-sm",
            "text-slate-500 dark:text-slate-400 font-medium shrink-0 ml-0.5"
          )}
        >
          {rating > 0 && <span className="font-semibold text-slate-700 mr-0.5">{rating.toFixed(1)}</span>}
          ({count})
        </span>
      )}
    </div>
  );
}
