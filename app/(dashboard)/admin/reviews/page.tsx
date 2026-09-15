"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useAuth } from "@/contexts/AuthContext";
import { getAllReviewsAdmin, deleteReview } from "@/app/actions/reviews";
import { AdminReview } from "@/lib/types/review";
import { AdminReviewList } from "@/components/reviews/AdminReviewList";
import { Pagination } from "@/components/ui/Pagination";
import { ToolbarPagination } from "@/components/ui/ToolbarPagination";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { AdminReviewTableSkeleton } from "@/components/skeletons";
import { Input } from "@/components/ui/input";
import { LastUpdated } from "@/components/ui/LastUpdated";
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
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // URL-synced state via nuqs
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: true }),
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
        setLastUpdated(Date.now());
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

  // Delete review handler
  const handleDeleteConfirm = async () => {
    if (!user || !reviewToDelete) return;

    setDeletingId(reviewToDelete);
    try {
      const result = await deleteReview(reviewToDelete, user.uid);

      if (result.success) {
        toast.success("Review deleted successfully");
        // Re-fetch current page
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Review Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Monitor and moderate customer reviews across all products.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">
            Total Reviews:{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">{totalCount}</strong>
          </span>
          <LastUpdated timestamp={lastUpdated} onRefresh={fetchReviews} loading={loading} />
        </div>
      </div>

      {/* Search & Top Pagination (Side-by-side on all viewports) */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by product, user, or review title..."
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            className="w-full pl-9 h-9 sm:h-10 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm rounded-lg"
          />
        </div>

        {totalPages > 1 && (
          <ToolbarPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isPending={loading}
          />
        )}
      </div>

      <div className="pt-4 relative min-h-100">
        {loading ? (
          <AdminReviewTableSkeleton />
        ) : (
          <AdminReviewList
            reviews={reviews}
            onDelete={(id) => setReviewToDelete(id)}
            deletingId={deletingId}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isPending={loading}
        />
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

