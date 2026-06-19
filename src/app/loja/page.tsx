import ProductGrid from "@/components/home/ProductGrid";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; sale?: string }>;
}) {
  const params = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(params.categoria
        ? { category: { slug: params.categoria } }
        : {}),
      ...(params.sale === "true" ? { salePrice: { not: null } } : {}),
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const title =
    params.sale === "true"
      ? "Sale"
      : params.categoria
      ? params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1)
      : "Toda a Coleção";

  return (
    <ProductGrid
      products={products.map(serializeProduct)}
      title={title}
      subtitle="UseCanuto"
    />
  );
}