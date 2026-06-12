"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllReviewsAdmin, deleteReview } from "@/app/actions/reviews";
import { AdminReview } from "@/lib/types/review";
import { AdminReviewList } from "@/components/reviews/AdminReviewList";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      if (!user) return;
      setLoading(true);
      
      try {
        const result = await getAllReviewsAdmin(user.uid);
        if (isMounted && result.success) {
          setReviews(result.reviews);
        } else if (isMounted && !result.success) {
          toast.error(result.error || "Failed to load reviews");
        }
      } catch (error) {
        if (isMounted) toast.error("An unexpected error occurred.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (reviewId: string) => {
    if (!user) return;
    
    // Quick confirmation dialog before destructive action
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteReview(reviewId, user.uid);
      
      if (result.success) {
        toast.success("Review deleted successfully");
        // Optimistic UI update
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Failed to delete review due to an unexpected error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Moderation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor and moderate customer reviews across all products.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Reviews: <span className="text-slate-900 dark:text-white">{reviews.length}</span>
        </div>
      </div>

      <div className="pt-4 relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="w-8 h-8 text-emerald-500" />
          </div>
        ) : (
          <AdminReviewList 
            reviews={reviews} 
            onDelete={handleDelete} 
            isDeleting={isDeleting} 
          />
        )}
      </div>
    </div>
  );
}
