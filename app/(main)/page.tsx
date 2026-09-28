import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HeroSectionSkeleton } from "@/components/landing/HeroSectionSkeleton";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { NewArrivalsSkeleton } from "@/components/landing/NewArrivalsSkeleton";
import { Craftsmanship } from "@/components/landing/Craftsmanship";
import { CategorySection } from "@/components/landing/CategorySection";
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
      <Craftsmanship />
      <CategorySection />
      <ValueProps />
      <NewsletterCTA />
    </div>
  );
}



