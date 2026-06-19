import { getSupabase } from "@/lib/supabase";
import { serializeProduct, parseJsonArray, type ProductData } from "@/lib/utils";

type DbProduct = {
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
  createdAt: string;
  updatedAt: string;
};

type DbCategory = { id: string; name: string; slug: string };

async function attachCategories(
  products: DbProduct[]
): Promise<ProductData[]> {
  if (!products.length) return [];

  const categoryIds = [
    ...new Set(products.map((p) => p.categoryId).filter(Boolean)),
  ] as string[];

  let categories: DbCategory[] = [];
  if (categoryIds.length) {
    const { data } = await getSupabase()
      .from("Category")
      .select("id, name, slug")
      .in("id", categoryIds);
    categories = data || [];
  }

  const catMap = new Map(categories.map((c) => [c.id, c]));

  return products.map((p) =>
    serializeProduct({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      category: p.categoryId ? catMap.get(p.categoryId) || null : null,
    })
  );
}

export async function fetchFeaturedProducts(limit = 8): Promise<ProductData[]> {
  const { data, error } = await getSupabase()
    .from("Product")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchFeaturedProducts]", error.message);
    return [];
  }

  return attachCategories(data || []);
}

export async function fetchProducts(filters?: {
  category?: string;
  sale?: boolean;
  activeOnly?: boolean;
}): Promise<ProductData[]> {
  let query = getSupabase().from("Product").select("*");

  if (filters?.activeOnly !== false) query = query.eq("active", true);
  if (filters?.sale) query = query.not("salePrice", "is", null);
  query = query.order("createdAt", { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error("[fetchProducts]", error.message);
    return [];
  }

  let products = data || [];

  if (filters?.category) {
    const { data: cat } = await getSupabase()
      .from("Category")
      .select("id")
      .eq("slug", filters.category)
      .single();

    if (cat) products = products.filter((p) => p.categoryId === cat.id);
  }

  return attachCategories(products);
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await getSupabase()
    .from("Product")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;

  const [product] = await attachCategories([data]);
  return product;
}

export async function fetchRelatedProducts(
  categoryId: string | null,
  excludeId: string
) {
  if (!categoryId) return [];

  const { data, error } = await getSupabase()
    .from("Product")
    .select("*")
    .eq("active", true)
    .eq("categoryId", categoryId)
    .neq("id", excludeId)
    .limit(4);

  if (error) return [];
  return attachCategories(data || []);
}

export async function fetchProductById(id: string) {
  const { data, error } = await getSupabase()
    .from("Product")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const [product] = await attachCategories([data]);
  return product;
}

export async function fetchAllProductsAdmin(): Promise<ProductData[]> {
  const { data, error } = await getSupabase()
    .from("Product")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) return [];
  return attachCategories(data || []);
}

export async function createProduct(input: {
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
}) {
  const { data, error } = await getSupabase()
    .from("Product")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      price: input.price,
      salePrice: input.salePrice,
      images: JSON.stringify(input.images),
      sizes: JSON.stringify(input.sizes),
      colors: JSON.stringify(input.colors),
      categoryId: input.categoryId,
      featured: input.featured,
      active: input.active,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const [product] = await attachCategories([data]);
  return product;
}

export async function updateProduct(
  id: string,
  input: Record<string, unknown>
) {
  const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.price !== undefined) payload.price = input.price;
  if (input.salePrice !== undefined) payload.salePrice = input.salePrice;
  if (input.images !== undefined) payload.images = JSON.stringify(input.images);
  if (input.sizes !== undefined) payload.sizes = JSON.stringify(input.sizes);
  if (input.colors !== undefined) payload.colors = JSON.stringify(input.colors);
  if (input.categoryId !== undefined) payload.categoryId = input.categoryId;
  if (input.featured !== undefined) payload.featured = input.featured;
  if (input.active !== undefined) payload.active = input.active;

  const { data, error } = await getSupabase()
    .from("Product")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const [product] = await attachCategories([data]);
  return product;
}

export async function deleteProduct(id: string) {
  const { error } = await getSupabase().from("Product").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchAdminByEmail(email: string) {
  const { data, error } = await getSupabase()
    .from("Admin")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

export async function fetchAdminById(id: string) {
  const { data, error } = await getSupabase()
    .from("Admin")
    .select("name, email")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createOrder(input: {
  items: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  paymentMethod?: string;
  stripeSessionId?: string;
}) {
  const { data, error } = await getSupabase()
    .from("Order")
    .insert(input)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function countProducts() {
  const { count, error } = await getSupabase()
    .from("Product")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count || 0;
}

export async function fetchCategories() {
  const { data, error } = await getSupabase()
    .from("Category")
    .select("*")
    .order("order", { ascending: true });

  if (error) return [];
  return data || [];
}