import { Review } from "@/lib/types/review";
import { StarRating } from "./StarRating";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  // Generate a 1-2 letter avatar initials
  const initials = review.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "p-5 border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex items-center justify-center w-10 h-10 font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-900 dark:text-white">
                {review.userName}
              </span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Purchase
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2.5">
        <StarRating rating={review.rating} size="sm" />
      </div>

      <h4 className="mb-1.5 font-semibold text-slate-900 dark:text-white">
        {review.title}
      </h4>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {review.body}
      </p>
    </div>
  );
}
