import WelcomeAnimation from "@/components/home/WelcomeAnimation";
import HeroBanner from "@/components/home/HeroBanner";
import PromoBar from "@/components/home/PromoBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";
import Newsletter from "@/components/home/Newsletter";
import { getFeaturedProducts } from "@/lib/products";
import { fetchSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, siteContent] = await Promise.all([
    getFeaturedProducts(),
    fetchSiteContent(),
  ]);

  return (
    <>
      <WelcomeAnimation />
      <HeroBanner />
      <PromoBar />
      <CategoryGrid />
      <ProductGrid
        products={products}
        title={siteContent.featuredSection.title}
        subtitle={siteContent.featuredSection.subtitle}
      />
      <Newsletter />
    </>
  );
}