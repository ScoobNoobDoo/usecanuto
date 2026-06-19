import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { fetchProductById, fetchCategories } from "@/lib/data";
import EditProduct from "./EditProduct";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const [product, categories] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
  ]);
  if (!product) notFound();

  return <EditProduct product={product} categories={categories} />;
}