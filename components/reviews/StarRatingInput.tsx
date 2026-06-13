"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  error?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  error,
}: StarRatingInputProps) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hover || value) >= star;
        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className={cn(
              "p-1 transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-800",
              error
                ? "focus:ring-2 focus:ring-red-500 outline-none"
                : "focus:ring-2 focus:ring-emerald-500 outline-none",
            )}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                isFilled
                  ? "fill-amber-500 text-amber-500"
                  : "text-slate-300 dark:text-slate-700",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
