import ProductGrid from "@/components/home/ProductGrid";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; sale?: string }>;
}) {
  const params = await searchParams;

  const products = await getAllProducts({
    category: params.categoria,
    sale: params.sale === "true",
  });

  const title =
    params.sale === "true"
      ? "Sale"
      : params.categoria
      ? params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1)
      : "Toda a Coleção";

  return (
    <ProductGrid
      products={products}
      title={title}
      subtitle="UseCanuto"
    />
  );
}