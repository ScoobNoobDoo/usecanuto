import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { fetchProductById } from "@/lib/data";
import EditProduct from "./EditProduct";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) notFound();

  return <EditProduct product={product} />;
}