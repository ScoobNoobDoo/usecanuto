import WelcomeAnimation from "@/components/home/WelcomeAnimation";
import HeroBanner from "@/components/home/HeroBanner";
import PromoBar from "@/components/home/PromoBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";
import Newsletter from "@/components/home/Newsletter";
import { getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <WelcomeAnimation />
      <HeroBanner />
      <PromoBar />
      <CategoryGrid />
      <ProductGrid
        products={products}
        title="Destaques"
        subtitle="Seleção especial"
      />
      <Newsletter />
    </>
  );
}