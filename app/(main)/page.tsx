import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { BrandStory } from "@/components/landing/BrandStory";
import { Testimonials } from "@/components/landing/Testimonials";
import { ValueProps } from "@/components/landing/ValueProps";
import { NewsletterCTA } from "@/components/landing/NewsletterCTA";
import {
  HeroSectionSkeleton,
  CategoryShowcaseSkeleton,
  NewArrivalsSkeleton,
  TestimonialsSkeleton,
} from "@/components/skeletons";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <TrustStrip />
      <FeaturedProducts />
      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<CategoryShowcaseSkeleton />}>
        <CategoryShowcase />
      </Suspense>
      <BrandStory />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
      <ValueProps />
      <NewsletterCTA />
    </div>
  );
}
