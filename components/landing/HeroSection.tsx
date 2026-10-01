import Link from "next/link";
import { ArrowRight, Star, Users, CheckCircle2 } from "lucide-react";
import { getFeaturedProducts, getNewArrivals } from "@/lib/data/products";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils/pricing";
import { getProductImageUrl } from "@/lib/utils/productImages";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * HeroSection Component (Server Component)
 *
 * High-converting e-commerce promotional campaign hero.
 * Features modern typography, clear commercial CTAs, and a multi-product
 * preview stage showcasing the flagship item alongside companion trending products.
 */
export async function HeroSection() {
  // Fetch flagship collection items (fallback to new arrivals if featured is empty)
  let products = await getFeaturedProducts(4);
  if (!products || products.length === 0) {
    products = await getNewArrivals(4);
  }

  const primaryProduct = products[0] || null;
  const companionProducts = products.slice(1, 4);

  const primaryDiscount = Boolean(
    primaryProduct && primaryProduct.discount > 0,
  );
  const primaryPrice = primaryProduct
    ? primaryDiscount
      ? calculateDiscountedPrice(primaryProduct.price, primaryProduct.discount)
      : primaryProduct.price
    : 0;

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-200/60 py-12 sm:py-16 lg:py-20">
      <div className={HOMEPAGE_TOKENS.container}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* =============================================================== */}
          {/* LEFT COLUMN: CAMPAIGN HEADLINE, VALUE PROPS & CTAs             */}
          {/* =============================================================== */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Campaign Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Curated 2026 Edition • Free Express Shipping</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
              Modern Design for <br className="hidden sm:inline" />
              <span className="text-emerald-600">Everyday Living.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore our curated collection of architectural desk essentials,
              ergonomic living furniture, and precision-engineered audio gear.
              Free express delivery on all orders over $100.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                href="/items"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 group shadow-md shadow-slate-900/10 active:scale-95"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/items?sort=newest"
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-900 border border-slate-200 hover:border-slate-400 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center active:scale-95 shadow-2xs"
              >
                <span>New Arrivals</span>
              </Link>
            </div>

            {/* Social Proof & Conversion Signals */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-slate-500 font-medium">
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
                <span>Quality Tested</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: MULTI-PRODUCT CAMPAIGN SHOWCASE                  */}
          {/* =============================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {primaryProduct ? (
              <>
                {/* 1. Primary Spotlight Card */}
                <Link
                  href={`/items/${primaryProduct.slug}`}
                  className="group relative bg-white border border-slate-200/80 rounded-2xl shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
                >
                  {/* Category & Discount Badges */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-2xs border border-slate-200/60">
                      {primaryProduct.category}
                    </span>
                    {primaryDiscount && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs">
                        -{primaryProduct.discount}%
                      </span>
                    )}
                  </div>

                  {/* Primary Image Stage */}
                  <div className="w-full sm:w-1/2 aspect-4/3 sm:aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={getProductImageUrl(primaryProduct.images)}
                      alt={primaryProduct.title}
                      fetchPriority="high"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Primary Product Info */}
                  <div className="w-full sm:w-1/2 p-5 sm:p-6 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 bg-white group-hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold text-slate-800">
                          {(primaryProduct.averageRating ?? 0).toFixed(1)}
                        </span>
                        <span className="text-slate-400">
                          ({primaryProduct.numReviews} reviews)
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {primaryProduct.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {primaryProduct.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-slate-900">
                          {formatPrice(primaryPrice)}
                        </span>
                        {primaryDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(primaryProduct.price)}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* 2. Companion Thumbnail Picks (Multi-Product Proof) */}
                {companionProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {companionProducts.map((item) => {
                      const itemDiscount = item.discount > 0;
                      const itemPrice = itemDiscount
                        ? calculateDiscountedPrice(item.price, item.discount)
                        : item.price;

                      return (
                        <Link
                          key={item._id}
                          href={`/items/${item.slug}`}
                          className="group bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-3 hover:border-emerald-300 hover:shadow-sm transition-all"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 shrink-0 overflow-hidden border border-slate-100">
                            <img
                              src={getProductImageUrl(item.images)}
                              alt={item.title}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">
                              {item.category}
                            </p>
                            <h3 className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs font-bold text-slate-900 mt-0.5">
                              {formatPrice(itemPrice)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Fallback if catalog is completely empty */
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
