import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HeroSectionSkeleton } from "@/components/landing/HeroSectionSkeleton";
import { CategorySection } from "@/components/landing/CategorySection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { ValueProps } from "@/components/landing/ValueProps";
import { Craftsmanship } from "@/components/landing/Craftsmanship";
import { NewsletterCTA } from "@/components/landing/NewsletterCTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <FeaturedProducts />
      <Craftsmanship />
      <CategorySection />
      <ValueProps />
      <NewsletterCTA />
    </div>
  );
}

