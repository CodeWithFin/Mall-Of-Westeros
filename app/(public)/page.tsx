import BestSelling from '@/components/BestSelling';
import Hero from '@/components/Hero';
import LatestProducts from '@/components/LatestProducts';
import Newsletter from '@/components/Newsletter';
import OurSpecs from '@/components/OurSpecs';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LatestProducts />
      <BestSelling />
      <OurSpecs />
      <Newsletter />
    </>
  );
}
