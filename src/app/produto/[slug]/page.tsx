import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  return (
    <ProductDetail
      product={serializeProduct(product)}
      related={related.map(serializeProduct)}
    />
  );
}