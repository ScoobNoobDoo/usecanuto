export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function parseJsonArray<T>(json: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export type ProductData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  categoryId: string | null;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; slug: string } | null;
};

export function serializeProduct(product: {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string;
  sizes: string;
  colors: string;
  categoryId: string | null;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; slug: string } | null;
}): ProductData {
  return {
    ...product,
    images: parseJsonArray<string>(product.images),
    sizes: parseJsonArray<string>(product.sizes),
    colors: parseJsonArray<string>(product.colors),
  };
}