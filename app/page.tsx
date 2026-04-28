import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/landing/CategorySection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { ValueProps } from "@/components/landing/ValueProps";
import { NewsletterCTA } from "@/components/landing/NewsletterCTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <ValueProps />
      <NewsletterCTA />
    </div>
  );
}
