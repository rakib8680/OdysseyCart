"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types/product";

interface NewArrivalsCarouselProps {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Mouse Drag to Scroll State (Desktop UX)
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Hardware-accelerated 60/120fps progress tracking via GPU translate3d
  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el || !thumb || !track) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      const ratio = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      const trackWidth = track.clientWidth;
      const thumbWidth = thumb.clientWidth;
      const maxTranslate = Math.max(0, trackWidth - thumbWidth);
      const translateX = ratio * maxTranslate;

      // GPU composited transform — zero layout reflow, zero jitter
      thumb.style.transform = `translate3d(${translateX}px, 0, 0)`;
    }

    // Update active index only when crossing card threshold to avoid unnecessary re-renders
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    if (firstCard) {
      const gap = window.innerWidth < 640 ? 16 : 24;
      const cardStep = firstCard.offsetWidth + gap;
      const newIdx = Math.min(
        Math.max(0, Math.round(scrollLeft / cardStep)),
        products.length - 1,
      );
      if (newIdx !== activeIndexRef.current) {
        activeIndexRef.current = newIdx;
        setActiveIndex(newIdx);
      }
    }
  }, [products.length]);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("resize", updateProgress);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateProgress]);

  // Smooth Chevron Navigation
  const scrollByDirection = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    if (!firstCard) return;

    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 16 : 24;
    const multiplier = isMobile ? 1 : 2;
    const step = (firstCard.offsetWidth + gap) * multiplier;
    const offset = direction === "left" ? -step : step;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isMouseDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    startScrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    if (Math.abs(walk) > 5 && !isDragging) {
      setIsDragging(true);
    }
    el.scrollLeft = startScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <div>
      {/* Header with Title and Modern Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fresh Drops 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 max-w-xl leading-relaxed">
            The latest additions to our architectural and design collection,
            curated for discerning modern spaces.
          </p>
        </div>

        {/* Action Link & Navigation Chevrons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-1 sm:pt-0">
          <Link
            href="/items?sort=newest"
            className="group inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Navigation Chevrons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollByDirection("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDirection("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snap-Scroll Product Runway with Harmonious Proportions */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 scroll-pr-4 sm:scroll-pr-6 lg:scroll-pr-8 scroll-smooth overscroll-x-contain ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-52.5 xs:w-56.25 sm:w-67.5 md:w-75 lg:w-82.5 xl:w-87.5 shrink-0 snap-start flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group select-none"
          >
            <ProductCard product={product} showMobileAction={false} />
          </div>
        ))}
        {/* End spacing spacer to ensure last item has breathing room */}
        <div className="w-2 sm:w-4 shrink-0" aria-hidden="true" />
      </div>

      {/* Apple-Style Smooth Sliding Progress Bar & Position Counter */}
      <div className="flex items-center justify-between mt-5 px-1">
        <div className="flex items-center gap-3">
          {/* Apple-style sliding pill track */}
          <div
            ref={trackRef}
            className="relative w-28 sm:w-40 h-1.5 bg-slate-200/80 rounded-full overflow-hidden"
          >
            <div
              ref={thumbRef}
              className="absolute top-0 bottom-0 left-0 w-9 sm:w-12 bg-slate-900 rounded-full will-change-transform"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 tabular-nums">
            {activeIndex + 1}{" "}
            <span className="text-slate-300 font-normal">/</span>{" "}
            {products.length}
          </span>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="hidden sm:inline">Drag or use arrows to browse</span>
          <span className="sm:hidden">Swipe to explore</span>
        </div>
      </div>
    </div>
  );
}
