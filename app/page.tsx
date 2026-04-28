import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/landing/CategorySection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategorySection />
    </div>
  );
}
