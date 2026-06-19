import { prisma } from "@/lib/db";
import { serializeProduct, type ProductData } from "@/lib/utils";

export async function getFeaturedProducts(limit = 8): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return products.map(serializeProduct);
  } catch (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
}

export async function getAllProducts(filters?: {
  category?: string;
  sale?: boolean;
}): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(filters?.category ? { category: { slug: filters.category } } : {}),
        ...(filters?.sale ? { salePrice: { not: null } } : {}),
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    return products.map(serializeProduct);
  } catch (error) {
    console.error("[getAllProducts]", error);
    return [];
  }
}