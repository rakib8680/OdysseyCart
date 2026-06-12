import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

interface ReviewSummaryProps {
  averageRating: number;
  numReviews: number;
  ratingDistribution: Record<string, number>;
  className?: string;
}

export function ReviewSummary({
  averageRating,
  numReviews,
  ratingDistribution,
  className,
}: ReviewSummaryProps) {
  // Safe fallback just in case
  const dist = ratingDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-8 items-center sm:items-start p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl",
        className,
      )}
    >
      {/* Left: Overall Score */}
      <div className="flex flex-col items-center justify-center min-w-[160px] shrink-0 space-y-2.5">
        <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
          {averageRating.toFixed(1)}
        </span>
        <StarRating rating={averageRating} size="lg" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Based on {numReviews} review{numReviews !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Right: Distribution Bars */}
      <div className="flex-1 w-full space-y-2.5 max-w-sm mx-auto sm:mx-0">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = dist[star.toString()] || 0;
          const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-4 font-medium text-slate-700 dark:text-slate-300">
                {star}★
              </span>
              <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-slate-500 dark:text-slate-400">
                {Math.round(percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
