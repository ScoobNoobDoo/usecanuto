import { fetchFeaturedProducts, fetchProducts } from "@/lib/data";

export async function getFeaturedProducts(limit = 8) {
  return fetchFeaturedProducts(limit);
}

export async function getAllProducts(filters?: {
  category?: string;
  sale?: boolean;
}) {
  return fetchProducts({ ...filters, activeOnly: true });
}