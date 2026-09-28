"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types/product";

interface NewArrivalsCarouselProps {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth =
      el.querySelector<HTMLElement>(":scope > div")?.offsetWidth || 300;
    const scrollOffset =
      direction === "left" ? -(cardWidth * 2) : cardWidth * 2;
    el.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  return (
    <div>
      {/* Header with Title and Desktop Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 mb-3 shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Fresh Drops 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
            The latest additions to our architectural and design collection,
            curated for discerning modern spaces.
          </p>
        </div>

        {/* Action Link & Carousel Chevrons */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/items?sort=newest"
            className="group inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span>View All New</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Navigation Chevrons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snap-Scroll Product Runway */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-65 sm:w-75 shrink-0 snap-start flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
