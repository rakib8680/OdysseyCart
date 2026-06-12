// Shared serialized review type used across server actions and review components.
// This is the shape of a review AFTER serialization from Mongoose
// (ObjectIds → strings, Dates → ISO strings).

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

// Server response shape for paginated review queries
export interface PaginatedReviews {
  reviews: Review[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Rating distribution for the ReviewSummary bar chart
export interface RatingDistribution {
  rating: number; // 1–5
  count: number;
  percentage: number;
}

// Extended review type for admin moderation (includes product info via $lookup)
export interface AdminReview extends Review {
  productTitle: string;
  productSlug: string;
}
