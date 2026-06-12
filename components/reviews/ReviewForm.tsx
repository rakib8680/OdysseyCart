"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { StarRatingInput } from "./StarRatingInput";
import { ReviewValidationSchema, ReviewInput } from "@/lib/validations/review";
import { submitReview } from "@/app/actions/reviews";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextArea } from "@/components/form/FormTextArea";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function ReviewForm({
  productId,
  onSuccess,
  onCancel,
  className,
}: ReviewFormProps) {
  const { user, dbUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(ReviewValidationSchema),
    defaultValues: {
      productId,
      userId: user?.uid || "",
      userName: dbUser?.name || user?.displayName || "Anonymous User",
      rating: 0,
      title: "",
      body: "",
    },
  });

  const onSubmit = async (data: ReviewInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitReview(data);

      if (result.success) {
        toast.success("Review submitted successfully!");
        reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl",
        className,
      )}
    >
      <div className="space-y-6">
        {/* Rating Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRatingInput
                value={field.value}
                onChange={field.onChange}
                error={!!errors.rating}
              />
            )}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
          )}
        </div>

        {/* Title */}
        <FormInput
          label="Review Title *"
          id="title"
          placeholder="Sum up your experience..."
          error={errors.title?.message}
          {...register("title")}
        />

        {/* Body */}
        <FormTextArea
          label="Detailed Review *"
          id="body"
          rows={4}
          className="resize-y"
          placeholder="What did you like or dislike? What should other shoppers know?"
          error={errors.body?.message}
          {...register("body")}
        />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
