import Link from "next/link";
import { ArrowRight, Star, Users, CheckCircle2, Sparkles } from "lucide-react";
import {
  getProductListings,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/data/products";
import { PRODUCT_CATEGORIES } from "@/lib/config/products";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils/pricing";
import { getProductImageUrl } from "@/lib/utils/productImages";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * HeroSection Component (Server Component)
 *
 * Premier Multi-Department Commercial Retail Storefront Hero.
 * Welcomes shoppers with an inclusive lifestyle narrative, department gateway
 * quick-jump pills, and a balanced multi-department visual showcase (Furniture + Tech).
 */
export async function HeroSection() {
  // Query representative items across distinct departments for visual balance
  const [furnitureProducts, techProducts] = await Promise.all([
    getProductListings({
      filter: { category: "Furniture" },
      sort: { isFeatured: -1, averageRating: -1, createdAt: -1 },
      limit: 1,
    }),
    getProductListings({
      filter: { category: "Tech" },
      sort: { isFeatured: -1, averageRating: -1, createdAt: -1 },
      limit: 1,
    }),
  ]);

  let primaryProduct = furnitureProducts[0] || null;
  let secondaryProduct = techProducts[0] || null;

  // Graceful fallback to featured products if a category has no inventory
  if (!primaryProduct || !secondaryProduct) {
    const featured = await getFeaturedProducts(2);
    if (!primaryProduct) primaryProduct = featured[0] || null;
    if (!secondaryProduct) secondaryProduct = featured[1] || null;
  }

  // Secondary fallback to newest catalog arrivals
  if (!primaryProduct) {
    const arrivals = await getNewArrivals(2);
    primaryProduct = arrivals[0] || null;
    secondaryProduct = arrivals[1] || null;
  }

  const primaryDiscount = Boolean(
    primaryProduct && primaryProduct.discount > 0,
  );
  const primaryPrice = primaryProduct
    ? primaryDiscount
      ? calculateDiscountedPrice(primaryProduct.price, primaryProduct.discount)
      : primaryProduct.price
    : 0;

  const secondaryDiscount = Boolean(
    secondaryProduct && secondaryProduct.discount > 0,
  );
  const secondaryPrice = secondaryProduct
    ? secondaryDiscount
      ? calculateDiscountedPrice(
          secondaryProduct.price,
          secondaryProduct.discount,
        )
      : secondaryProduct.price
    : 0;

  return (
    <section className="relative w-full overflow-hidden bg-ambient-top border-b border-slate-200/60 py-12 sm:py-16 lg:py-20">
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* =============================================================== */}
          {/* LEFT COLUMN: RETAIL BRAND INVITATION & DEPARTMENT GATEWAYS      */}
          {/* =============================================================== */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Seasonal Collection Kicker Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 bg-linear-to-r from-emerald-50 via-teal-50/60 to-emerald-50/40 text-emerald-900 rounded-full text-[10.5px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider border border-emerald-200/70 shadow-2xs whitespace-nowrap max-w-full">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span>
                Spring 2026 <span className="hidden sm:inline">Collection </span>• Free Shipping Over $100
              </span>
            </div>

            {/* Inclusive Multi-Category Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
              Thoughtfully <br className="hidden sm:inline" /> Curated for{" "}
              <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-emerald-800 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
                Home, Work & Life.
              </span>
            </h1>

            {/* Lifestyle Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover timeless furniture, ambient lighting, precision audio,
              and daily essentials designed to elevate your everyday spaces.
            </p>

            {/* Commercial Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                href="/items"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-md shadow-slate-900/10 active:scale-95"
              >
                <span>Shop All Departments</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/items?sort=discount"
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-900 border border-slate-200 hover:border-slate-400 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center active:scale-95 shadow-2xs"
              >
                <span>Explore Deals</span>
              </Link>
            </div>

            {/* Department Quick-Jump Gateways (DRY from PRODUCT_CATEGORIES) */}
            <div className="pt-1 sm:pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Browse by Department:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/60 hover:border-emerald-200 text-xs font-semibold transition-all group"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Proof & Conversion Signals */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                <span className="font-semibold text-slate-800">
                  4.9 / 5 Rating
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1,200+ Verified Buyers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: MULTI-DEPARTMENT BALANCED SHOWCASE               */}
          {/* =============================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {primaryProduct ? (
              <>
                {/* 1. Primary Department Spotlight (Home & Living) */}
                <Link
                  href={`/items/${primaryProduct.slug}`}
                  className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                >
                  <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-xl bg-linear-to-b from-slate-50/90 via-slate-50 to-slate-100/70 flex items-center justify-center p-3 shrink-0 overflow-hidden border border-slate-200/60 shadow-2xs">
                    <img
                      src={getProductImageUrl(primaryProduct.images)}
                      alt={primaryProduct.title}
                      fetchPriority="high"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {primaryProduct.category}
                        </span>
                        {primaryDiscount && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                            -{primaryProduct.discount}%
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {primaryProduct.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {primaryProduct.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-slate-100 mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {formatPrice(primaryPrice)}
                        </span>
                        {primaryDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(primaryProduct.price)}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* 2. Secondary Department Spotlight (Workspace & Tech / Accessories) */}
                {secondaryProduct && (
                  <Link
                    href={`/items/${secondaryProduct.slug}`}
                    className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                  >
                    <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-xl bg-linear-to-b from-slate-50/90 via-slate-50 to-slate-100/70 flex items-center justify-center p-3 shrink-0 overflow-hidden border border-slate-200/60 shadow-2xs">
                      <img
                        src={getProductImageUrl(secondaryProduct.images)}
                        alt={secondaryProduct.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {secondaryProduct.category}
                          </span>
                          {secondaryDiscount && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                              -{secondaryProduct.discount}%
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {secondaryProduct.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {secondaryProduct.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-slate-100 mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {formatPrice(secondaryPrice)}
                          </span>
                          {secondaryDiscount && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(secondaryProduct.price)}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <p>New collections arriving soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
