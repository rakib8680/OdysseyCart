import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { getHeroProduct } from "@/lib/data/products";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils/pricing";
import { getProductImageUrl } from "@/lib/utils/productImages";

export async function HeroSection() {
  const product = await getHeroProduct();

  const hasDiscount = Boolean(product && product.discount > 0);
  const discountedPrice = product
    ? calculateDiscountedPrice(product.price, product.discount)
    : 0;

  const targetHref = product ? `/items/${product.slug}` : "/items";
  const displayImage = product ? getProductImageUrl(product.images) : getProductImageUrl([]);

  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 lg:py-20 overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
      {/* Subtle Architectural Ambient Background */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-150 h-150 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-125 h-125 rounded-full bg-slate-200/50 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Brand Story & Real Product CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
          {/* Dynamic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{product?.isFeatured ? "Featured Flagship" : "Architectural Living 2026"}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Precision <br />
            <span className="text-emerald-600">Engineered</span> <br />
            for Modern Living.
          </h1>

          {/* Dynamic Description */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            {product?.shortDescription ||
              "Discover our curated collection of heirloom-grade tech essentials, minimalist furniture, and everyday carry gear designed with timeless geometric balance."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href={targetHref}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/25 active:scale-95"
            >
              <span>{product ? `Shop ${product.title}` : "Shop Collection"}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/items"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 hover:border-slate-400 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center active:scale-95 shadow-xs"
            >
              Explore Full Catalog
            </Link>
          </div>

          {/* Trust & Proof Micro-Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Free Express Worldwide</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Lifetime Warranty</span>
            </div>
            {product && product.numReviews > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-slate-800">
                  {product.averageRating.toFixed(1)}
                </span>
                <span>({product.numReviews} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Real Product Hero Card */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <Link
            href={targetHref}
            className="group relative w-full max-w-lg aspect-4/3 sm:aspect-square bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 flex flex-col overflow-hidden hover:border-emerald-300 hover:shadow-2xl transition-all duration-500"
          >
            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-xs border border-slate-200/60">
                {product?.category || "Flagship"}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20">
              {hasDiscount ? (
                <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  -{product!.discount}% OFF
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-900/90 text-white backdrop-blur-md text-[11px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  {product?.stockQuantity && product.stockQuantity > 0 ? "In Stock" : "Limited Edition"}
                </span>
              )}
            </div>

            {/* Product Image Stage */}
            <div className="flex-1 w-full bg-slate-50 flex items-center justify-center overflow-hidden relative p-8">
              <img
                src={displayImage}
                alt={product?.title || "Odyssey Flagship Product"}
                fetchPriority="high"
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom Product Details Bar */}
            <div className="bg-white border-t border-slate-100 p-5 sm:p-6 flex justify-between items-center group-hover:bg-slate-50/80 transition-colors">
              <div className="space-y-1 pr-4 min-w-0">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate group-hover:text-emerald-700 transition-colors">
                  {product?.title || "Chronos Smartwatch"}
                </h3>
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product!.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-extrabold text-slate-900">
                      {product ? formatPrice(product.price) : "$299.00"}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    USD
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs shrink-0">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
