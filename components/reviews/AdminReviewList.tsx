import Link from "next/link";
import { Trash2, ExternalLink, MessageSquareOff } from "lucide-react";
import { AdminReview } from "@/lib/types/review";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminReviewListProps {
  reviews: AdminReview[];
  onDelete: (reviewId: string) => void;
  deletingId: string | null;
}

export function AdminReviewList({
  reviews,
  onDelete,
  deletingId,
}: AdminReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareOff}
        title="No reviews found"
        description="There are currently no reviews submitted across any products."
      />
    );
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="px-6 py-4">Review Date</TableHead>
            <TableHead className="px-6 py-4">Product</TableHead>
            <TableHead className="px-6 py-4">Rating</TableHead>
            <TableHead className="px-6 py-4">Review Content</TableHead>
            <TableHead className="px-6 py-4">Author</TableHead>
            <TableHead className="px-6 py-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="px-6 py-4 max-w-[200px]">
                <Link
                  href={`/items/${review.productSlug}`}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium truncate"
                  target="_blank"
                >
                  <span className="truncate">{review.productTitle}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4">
                <StarRating rating={review.rating} size="sm" />
              </TableCell>
              <TableCell className="px-6 py-4 max-w-[300px]">
                <div className="font-semibold text-slate-900 dark:text-white mb-1 truncate">
                  {review.title}
                </div>
                <div className="text-slate-600 dark:text-slate-400 line-clamp-2 whitespace-normal">
                  {review.body}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">
                  {review.userName}
                </div>
                {review.isVerifiedPurchase && (
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] px-1.5 py-0"
                  >
                    Verified
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(review._id)}
                  disabled={deletingId === review._id}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
