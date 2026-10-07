import Link from "next/link";
import {
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { getTopReviews } from "@/app/actions/reviews";
import { StarRating } from "@/components/reviews/StarRating";
import { formatDate } from "@/lib/utils/date";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

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
    <section
      className={`bg-white border-b border-slate-200/60 overflow-hidden ${HOMEPAGE_TOKENS.sectionPadding}`}
    >
      <div className={HOMEPAGE_TOKENS.container}>
        {/* Standardized Section Header */}
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from verified buyers across the globe."
          align="center"
        />

        {/* Dynamic Reviews Grid */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
            {reviews.map((review) => {
              const initial =
                review.userName?.trim().charAt(0).toUpperCase() || "C";

              return (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Row: Stars + Verified Badge */}
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                      <div className="scale-90 sm:scale-100 origin-left">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-emerald-100 w-fit">
                        <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                        <span className="hidden xs:inline">Verified Buyer</span>
                        <span className="xs:hidden">Verified</span>
                      </span>
                    </div>

                    {/* Review Title */}
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base lg:text-lg mt-2 sm:mt-4 mb-1 sm:mb-2 truncate group-hover:text-emerald-700 transition-colors">
                      {review.title}
                    </h3>

                    {/* Review Excerpt */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-snug sm:leading-relaxed line-clamp-3 italic mb-3 sm:mb-6">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Details + Product Tag */}
                  <div className="pt-2.5 sm:pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-700 uppercase shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                            {review.userName}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400">
                            {formatDate(review.createdAt, "short")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Linked Product Preview */}
                    {review.productSlug ? (
                      <Link
                        href={`/items/${review.productSlug}`}
                        className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 hover:text-emerald-600 transition-colors group/prod"
                      >
                        <span className="truncate max-w-21.25 xs:max-w-28 sm:max-w-50 font-medium text-slate-700 group-hover/prod:text-emerald-600">
                          {review.productTitle}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 shrink-0 flex items-center gap-0.5">
                          View{" "}
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/prod:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    ) : review.productTitle ? (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                        <span className="truncate max-w-21.25 xs:max-w-28 sm:max-w-50 font-medium text-slate-700">
                          {review.productTitle}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Brand Trust & Satisfaction Promise (Graceful empty-reviews fallback) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Heirloom Craftsmanship
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Every product in our catalog undergoes rigorous multi-stage
                  quality control. Premium materials engineered for decade-long
                  durability.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Lifetime Coverage
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  30-Day In-Home Trial
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Experience our pieces in your living space. If it doesn&apos;t
                  meet your standards of harmony, return it with zero friction.
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
                  Have questions regarding dimensions, materials, or custom
                  setups? Our design team responds personally within 24 hours.
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
