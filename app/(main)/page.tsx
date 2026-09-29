import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { BestSellers } from "@/components/landing/BestSellers";
import { OnSale } from "@/components/landing/OnSale";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { Testimonials } from "@/components/landing/Testimonials";
import { NewsletterCTA } from "@/components/landing/NewsletterCTA";
import {
  HeroSectionSkeleton,
  CategoryShowcaseSkeleton,
  BestSellersSkeleton,
  OnSaleSkeleton,
  NewArrivalsSkeleton,
  TestimonialsSkeleton,
} from "@/components/skeletons";

/**
 * OdysseyCart Homepage V2 (Server Component)
 *
 * Implements modern commercial e-commerce merchandising architecture:
 * 1. HeroSection: Multi-product visual campaign showcase with clear conversion CTAs.
 * 2. TrustStrip: Immediate buyer confidence reassurance (warranty, delivery, returns).
 * 3. CategoryShowcase: High-intent curated visual taxonomy.
 * 4. BestSellers: High-conversion interactive product carousel with top sales velocity.
 * 5. OnSale: High-urgency discount deals grid with dynamic markdown badges.
 * 6. NewArrivals: Interactive product carousel with latest catalog additions.
 * 7. Testimonials: Verified customer reviews and social proof.
 * 8. NewsletterCTA: VIP discount capture with immediate lead acquisition.
 *
 * All asynchronous data-fetching sections stream independently through Suspense
 * with zero-CLS dedicated skeletons imported from `@/components/skeletons`.
 */
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Campaign Showcase */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* 2. Trust & Value Reassurance */}
      <TrustStrip />

      {/* 3. Category Taxonomy */}
      <Suspense fallback={<CategoryShowcaseSkeleton />}>
        <CategoryShowcase />
      </Suspense>

      {/* 4. Best Sellers Carousel */}
      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellers />
      </Suspense>

      {/* 5. On Sale / Deals Grid */}
      <Suspense fallback={<OnSaleSkeleton />}>
        <OnSale />
      </Suspense>

      {/* 6. New Arrivals Carousel */}
      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      {/* 7. Verified Social Proof */}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>

      {/* 8. VIP Newsletter Capture */}
      <NewsletterCTA />
    </div>
  );
}
