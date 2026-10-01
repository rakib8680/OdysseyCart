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
            className="w-65 sm:w-70 lg:w-75 shrink-0"
          >
            <ProductCard
              product={product}
              showMobileAction={false}
              className="h-full select-none"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselProgress />
    </Carousel>
  );
}
