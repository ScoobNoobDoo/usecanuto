import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const active = searchParams.get("active") !== "false";

  const products = await prisma.product.findMany({
    where: {
      ...(active ? { active: true } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(category
        ? { category: { slug: category } }
        : {}),
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slug = slugify(body.title) + "-" + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug,
        description: body.description || "",
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        images: JSON.stringify(body.images || []),
        sizes: JSON.stringify(body.sizes || []),
        colors: JSON.stringify(body.colors || []),
        categoryId: body.categoryId || null,
        featured: body.featured || false,
        active: body.active !== false,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}