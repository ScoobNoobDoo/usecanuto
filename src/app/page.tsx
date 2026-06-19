import WelcomeAnimation from "@/components/home/WelcomeAnimation";
import HeroBanner from "@/components/home/HeroBanner";
import PromoBar from "@/components/home/PromoBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";
import Newsletter from "@/components/home/Newsletter";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <WelcomeAnimation />
      <HeroBanner />
      <PromoBar />
      <CategoryGrid />
      <ProductGrid
        products={products.map(serializeProduct)}
        title="Destaques"
        subtitle="Seleção especial"
      />
      <Newsletter />
    </>
  );
}