import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(serializeProduct(product));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.salePrice !== undefined && {
          salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        }),
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.sizes !== undefined && { sizes: JSON.stringify(body.sizes) }),
        ...(body.colors !== undefined && { colors: JSON.stringify(body.colors) }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.active !== undefined && { active: body.active }),
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(serializeProduct(product));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}