/**
 * Shared review sorting configuration.
 * Used by:
 * - Client: `ReviewSection` to render sort dropdown options
 * - Server: Mapping sort options to MongoDB sort criteria in `getProductReviews`
 */

// ==========================================
// SORT OPTIONS
// ==========================================
export type ReviewSortOption = "newest" | "highest" | "lowest";

export interface ReviewSortConfig {
  value: ReviewSortOption;
  label: string;
}

export const REVIEW_SORT_OPTIONS: ReviewSortConfig[] = [
  { value: "newest", label: "Newest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

// ==========================================
// MONGODB SORT MAPPINGS
// ==========================================
/**
 * MongoDB sorting mappings for each ReviewSortOption.
 * Includes deterministic unique tie-breakers (_id) to guarantee cursor stability.
 */
export const REVIEW_DB_SORT_MAP: Record<
  ReviewSortOption,
  Record<string, 1 | -1>
> = {
  newest: { createdAt: -1, _id: -1 },
  highest: { rating: -1, createdAt: -1, _id: -1 },
  lowest: { rating: 1, createdAt: -1, _id: -1 },
};
