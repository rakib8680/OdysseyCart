"use client";

import ProductCard from "@/components/ProductCard";
import { SectionHeader } from "@/components/landing/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselProgress,
} from "@/components/ui/Carousel";
import type { Product } from "@/lib/types/product";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

export interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * ProductCarousel Component
 *
 * Domain wrapper that pairs the generic Carousel primitive with
 * SectionHeader and ProductCard for product runway presentations.
 */
export function ProductCarousel({
  products,
  title,
  subtitle,
  action,
}: ProductCarouselProps) {
  return (
    <Carousel itemCount={products.length}>
      <SectionHeader title={title} subtitle={subtitle} action={action}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </SectionHeader>

      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product._id}
            className="w-52.5 xs:w-56.25 sm:w-67.5 md:w-75 lg:w-82.5 xl:w-87.5"
          >
            <div
              className={`h-full bg-white ${HOMEPAGE_TOKENS.cardRadius} border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group select-none`}
            >
              <ProductCard product={product} showMobileAction={false} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselProgress />
    </Carousel>
  );
}
