import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({
  rating,
  size = "md",
  showCount = false,
  count = 0,
  className,
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  const iconSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          if (roundedRating >= star) {
            return (
              <Star
                key={star}
                className={cn(iconSize, "fill-amber-500 text-amber-500")}
              />
            );
          } else if (roundedRating === star - 0.5) {
            return (
              <StarHalf
                key={star}
                className={cn(iconSize, "fill-amber-500 text-amber-500")}
              />
            );
          } else {
            return (
              <Star
                key={star}
                className={cn(iconSize, "text-slate-300 dark:text-slate-700")}
              />
            );
          }
        })}
      </div>
      {showCount && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
}
