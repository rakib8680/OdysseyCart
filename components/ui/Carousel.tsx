"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

interface CarouselContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  thumbRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  activeIndex: number;
  totalItems: number;
  isDragging: boolean;
  updateProgress: () => void;
  scrollByDirection: (direction: "left" | "right") => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// ============================================================================
// CAROUSEL ROOT
// ============================================================================

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  itemCount: number;
  children: React.ReactNode;
}

/**
 * Pure, domain-agnostic Carousel primitive.
 * Supports GPU-composited progress tracking (translate3d), mouse dragging,
 * touch swipe, and flexible headless subcomponents.
 */
export function Carousel({
  itemCount,
  children,
  className,
  ...props
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Hardware-accelerated 60/120fps progress tracking via GPU translate3d
  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);

    if (thumb && track && maxScroll > 0) {
      const ratio = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      const trackWidth = track.clientWidth;
      const thumbWidth = thumb.clientWidth;
      const maxTranslate = Math.max(0, trackWidth - thumbWidth);
      const translateX = ratio * maxTranslate;

      // GPU composited transform — zero layout reflow, zero jitter
      thumb.style.transform = `translate3d(${translateX}px, 0, 0)`;
    }

    // Update active index based on item step
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    if (firstCard && itemCount > 0) {
      const gap = window.innerWidth < 640 ? 12 : 24;
      const cardStep = firstCard.offsetWidth + gap;
      if (cardStep > 0) {
        const newIdx = Math.min(
          Math.max(0, Math.round(scrollLeft / cardStep)),
          itemCount - 1,
        );
        if (newIdx !== activeIndexRef.current) {
          activeIndexRef.current = newIdx;
          setActiveIndex(newIdx);
        }
      }
    }
  }, [itemCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateProgress();

    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateProgress);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateProgress]);

  const scrollByDirection = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    if (!firstCard) return;

    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 12 : 24;
    const step = firstCard.offsetWidth + gap;
    const offset = direction === "left" ? -step : step;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        scrollRef,
        trackRef,
        thumbRef,
        canScrollLeft,
        canScrollRight,
        activeIndex,
        totalItems: itemCount,
        isDragging,
        updateProgress,
        scrollByDirection,
      }}
    >
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// ============================================================================
// CAROUSEL CONTENT (SCROLL RUNWAY)
// ============================================================================

export function CarouselContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollRef, updateProgress } = useCarousel();
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasMoved = useRef(false);
  const [internalDragging, setInternalDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isMouseDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - el.offsetLeft;
    startScrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    if (Math.abs(walk) > 5) {
      if (!internalDragging) setInternalDragging(true);
      hasMoved.current = true;
      e.preventDefault();
      el.scrollLeft = startScrollLeft.current - walk;
      updateProgress();
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setTimeout(() => {
      setInternalDragging(false);
      hasMoved.current = false;
    }, 50);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClickCapture={handleClickCapture}
      className={cn(
        "flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1",
        "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        "scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 scroll-pr-4 sm:scroll-pr-6 lg:scroll-pr-8",
        "scroll-smooth overscroll-x-contain",
        internalDragging ? "cursor-grabbing select-none" : "cursor-grab",
        className,
      )}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      {...props}
    >
      {children}
      {/* End spacer for edge breathing room */}
      <div className="w-2 sm:w-4 shrink-0" aria-hidden="true" />
    </div>
  );
}

// ============================================================================
// CAROUSEL ITEM (SLIDE)
// ============================================================================

export function CarouselItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("shrink-0 snap-start", className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// CAROUSEL NAVIGATION CHEVRONS
// ============================================================================

export function CarouselPrevious({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollByDirection, canScrollLeft } = useCarousel();

  return (
    <button
      type="button"
      onClick={() => scrollByDirection("left")}
      disabled={!canScrollLeft}
      aria-label="Previous slide"
      className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700",
        "hover:bg-slate-900 hover:text-white hover:border-slate-900",
        "disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
}

export function CarouselNext({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollByDirection, canScrollRight } = useCarousel();

  return (
    <button
      type="button"
      onClick={() => scrollByDirection("right")}
      disabled={!canScrollRight}
      aria-label="Next slide"
      className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700",
        "hover:bg-slate-900 hover:text-white hover:border-slate-900",
        "disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

// ============================================================================
// CAROUSEL PROGRESS BAR & POSITION COUNTER
// ============================================================================

export interface CarouselProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dragText?: string;
  swipeText?: string;
}

export function CarouselProgress({
  dragText = "Drag or use arrows to browse",
  swipeText = "Swipe to explore",
  className,
  ...props
}: CarouselProgressProps) {
  const { trackRef, thumbRef, activeIndex, totalItems } = useCarousel();

  if (totalItems <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between mt-5 px-1",
        className,
      )}
      {...props}
    >
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
          <span className="text-slate-300 font-normal">/</span> {totalItems}
        </span>
      </div>

      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span className="hidden sm:inline">{dragText}</span>
        <span className="sm:hidden">{swipeText}</span>
      </div>
    </div>
  );
}
