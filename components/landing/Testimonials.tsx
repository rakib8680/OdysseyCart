import Link from "next/link";
import { ShieldCheck, Sparkles, MessageSquare, ArrowRight, HeartHandshake } from "lucide-react";
import { getTopReviews } from "@/app/actions/reviews";
import { StarRating } from "@/components/reviews/StarRating";
import { formatDate } from "@/lib/utils/date";

/**
 * Testimonials Component (Server Component)
 *
 * Displays verified customer reviews from MongoDB to eliminate the conversion
 * social-proof gap. Gracefully renders a brand satisfaction promise if no
 * approved reviews exist in the database yet.
 */
export async function Testimonials() {
  const reviews = await getTopReviews(6);

  return (
    <section className="py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 mb-3 shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Verified Social Proof</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Loved by Discerning Creators.
          </h2>

          <p className="text-slate-500 text-sm sm:text-base mt-3">
            Real feedback from our global community of architects, engineers, and minimalist design enthusiasts.
          </p>
        </div>

        {/* Dynamic Reviews Grid */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((review) => {
              const initial = review.userName?.trim().charAt(0).toUpperCase() || "C";

              return (
                <div
                  key={review._id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Row: Stars + Verified Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>

                    {/* Review Title */}
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-4 mb-2 truncate group-hover:text-emerald-700 transition-colors">
                      {review.title}
                    </h3>

                    {/* Review Excerpt */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic mb-6">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Details + Product Tag */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase shrink-0">
                          {initial}
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-slate-900">
                            {review.userName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {formatDate(review.createdAt, "short")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Linked Product Preview */}
                    {review.productSlug && (
                      <Link
                        href={`/items/${review.productSlug}`}
                        className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 hover:text-emerald-600 transition-colors group/prod"
                      >
                        <span className="truncate max-w-50 font-medium text-slate-700 group-hover/prod:text-emerald-600">
                          {review.productTitle}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 shrink-0 flex items-center gap-0.5">
                          View <ArrowRight className="w-3 h-3 group-hover/prod:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Graceful Fallback: Customer Satisfaction Promise Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Unconditional Guarantee
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Every product undergoes strict dimensional testing. If anything falters under normal use, we repair or replace it promptly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Lifetime Coverage
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  30-Day In-Home Trial
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Experience our pieces in your living space. If it doesn&apos;t meet your standards of geometric harmony, return it with zero friction.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                100% Risk Free
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Design Studio Support
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Have questions regarding dimensions, materials, or custom setups? Our design team responds personally within 24 hours.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Human Concierge
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
