import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HeroSectionSkeleton } from "@/components/landing/HeroSectionSkeleton";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { NewArrivalsSkeleton } from "@/components/landing/NewArrivalsSkeleton";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { CategoryShowcaseSkeleton } from "@/components/landing/CategoryShowcaseSkeleton";
import { BrandStory } from "@/components/landing/BrandStory";
import { Testimonials } from "@/components/landing/Testimonials";
import { TestimonialsSkeleton } from "@/components/landing/TestimonialsSkeleton";
import { ValueProps } from "@/components/landing/ValueProps";
import { NewsletterCTA } from "@/components/landing/NewsletterCTA";

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





