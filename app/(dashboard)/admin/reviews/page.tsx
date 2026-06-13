"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useAuth } from "@/contexts/AuthContext";
import { getAllReviewsAdmin, deleteReview } from "@/app/actions/reviews";
import { AdminReview } from "@/lib/types/review";
import { AdminReviewList } from "@/components/reviews/AdminReviewList";
import { Pagination } from "@/components/items/Pagination";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/useDebounce";

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // URL-synced state via nuqs
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );

  // Debounce search to avoid hammering the server
  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Fetch reviews — runs on page, debounced search, or user change
  const fetchReviews = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await getAllReviewsAdmin(user.uid, page, debouncedSearch);
      if (result.success) {
        setReviews(result.reviews);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      } else {
        toast.error(result.error || "Failed to load reviews");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteConfirm = async () => {
    if (!user || !reviewToDelete) return;

    setDeletingId(reviewToDelete);
    try {
      const result = await deleteReview(reviewToDelete, user.uid);

      if (result.success) {
        toast.success("Review deleted successfully");
        // Re-fetch current page (instead of optimistic remove, which could leave an empty page)
        await fetchReviews();
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Failed to delete review due to an unexpected error");
    } finally {
      setDeletingId(null);
      setReviewToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Review Moderation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor and moderate customer reviews across all products.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Reviews:{" "}
          <span className="text-slate-900 dark:text-white">{totalCount}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by product, user, or review title..."
          value={search}
          onChange={(e) => setSearch(e.target.value || null)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="pt-4 relative min-h-[400px]">
        {loading ? (
          <AdminReviewsSkeleton />
        ) : (
          <AdminReviewList
            reviews={reviews}
            onDelete={(id) => setReviewToDelete(id)}
            deletingId={deletingId}
          />
        )}
      </div>

      {/* Pagination — reusing Phase 15 component */}
      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}

      {/* Delete Confirmation Modal — reusing existing component */}
      <DeleteConfirmModal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={!!deletingId}
        itemName="this review"
        confirmLabel="Delete Review"
      />
    </div>
  );
}

// ==========================================
// TABLE SKELETON — matches AdminReviewList layout
// ==========================================
function AdminReviewsSkeleton() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 grid grid-cols-6 gap-4">
        {["w-24", "w-20", "w-16", "w-32", "w-16", "w-12"].map((w, i) => (
          <Skeleton key={i} className={`h-4 ${w}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 grid grid-cols-6 gap-4 items-center border-t border-slate-100 dark:border-slate-800"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
        </div>
      ))}
    </div>
  );
}
