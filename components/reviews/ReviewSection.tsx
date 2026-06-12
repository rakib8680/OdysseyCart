"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { getProductReviews, canUserReview } from "@/app/actions/reviews";
import { Review } from "@/lib/types/review";
import { Product } from "@/lib/types/product";
import { REVIEW_SORT_OPTIONS, ReviewSortOption } from "@/lib/config/reviews";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  product: Product;
}

export function ReviewSection({ product }: ReviewSectionProps) {
  const { user, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ReviewSortOption>("newest");
  const [hasMore, setHasMore] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0); // Bump to force refetch
  
  // Separation of loading states for optimal UX
  const [isFetching, setIsFetching] = useState(true); // For initial load & sort changes
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For pagination

  const [isWriting, setIsWriting] = useState(false);
  const [userCanReview, setUserCanReview] = useState(false);

  // 1. Check if user is eligible to write a review
  useEffect(() => {
    let isMounted = true;

    async function checkEligibility() {
      if (authLoading) return; // Wait for auth context to hydrate

      if (!user?.uid) {
        if (isMounted) setUserCanReview(false);
        return;
      }
      
      try {
        const res = await canUserReview(user.uid, product._id);
        if (isMounted) setUserCanReview(res.canReview);
      } catch (error) {
        console.error("Failed to check review eligibility", error);
      }
    }

    checkEligibility();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, authLoading, product._id]);

  // 2. Fetch reviews (Initial load & Sort changes)
  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      setIsFetching(true);
      try {
        const res = await getProductReviews(
          product._id,
          1, // page
          5, // limit
          sortBy,
        );

        if (isMounted && res) {
          setReviews(res.reviews);
          setHasMore(res.currentPage < res.totalPages);
          setPage(1);
        }
      } catch (error) {
        if (isMounted) toast.error("Failed to load reviews");
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [sortBy, product._id, refetchTrigger]);

  // 3. Handle Load More pagination
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = page + 1;
    setIsLoadingMore(true);
    
    try {
      const res = await getProductReviews(
        product._id,
        nextPage,
        5,
        sortBy,
      );

      if (res) {
        setReviews((prev) => [...prev, ...res.reviews]);
        setHasMore(res.currentPage < res.totalPages);
        setPage(nextPage);
      }
    } catch (error) {
      toast.error("Failed to load more reviews");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleReviewSuccess = () => {
    setIsWriting(false);
    setUserCanReview(false); // Lock the form instantly
    
    // Reset to page 1 and newest to immediately show the new review
    if (sortBy !== "newest") {
      setSortBy("newest"); // This triggers the useEffect refetch
    } else {
      // Already on newest — bump the trigger to force the useEffect to re-run
      setRefetchTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="py-12 mt-12 border-t border-slate-200 dark:border-slate-800">
      <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
        Customer Reviews
      </h2>

      {/* Summary Section */}
      <ReviewSummary
        averageRating={product.averageRating || 0}
        numReviews={product.numReviews || 0}
        ratingDistribution={product.ratingDistribution || {}}
        className="mb-8"
      />

      {/* Controls & Form Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
            disabled={isFetching}
            className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {REVIEW_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {userCanReview && !isWriting && (
          <Button
            onClick={() => setIsWriting(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {isWriting && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <ReviewForm
            productId={product._id}
            onSuccess={handleReviewSuccess}
            onCancel={() => setIsWriting(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 relative min-h-[200px]">
        {isFetching ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 z-10">
            <Spinner className="w-8 h-8 text-emerald-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : null}

        <div className={cn("space-y-6 transition-opacity", isFetching && "opacity-50 pointer-events-none")}>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>

        {hasMore && !isFetching && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Loading...
                </>
              ) : (
                "Load More Reviews"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
