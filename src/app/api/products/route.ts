import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { fetchProducts, createProduct } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const featured = searchParams.get("featured") === "true";
  const active = searchParams.get("active") !== "false";

  const products = await fetchProducts({
    category,
    sale: searchParams.get("sale") === "true",
    activeOnly: active,
  });

  const filtered = featured
    ? products.filter((p) => p.featured)
    : products;

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const slug = slugify(body.title) + "-" + Date.now().toString(36);

    const product = await createProduct({
      title: body.title,
      slug,
      description: body.description || "",
      price: parseFloat(body.price),
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      images: body.images || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
      categoryId: body.categoryId || null,
      featured: body.featured || false,
      active: body.active !== false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}