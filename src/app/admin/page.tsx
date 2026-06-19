import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeProduct, formatPrice } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  return (
    <AdminDashboard
      products={products.map(serializeProduct)}
      adminEmail={session.email}
    />
  );
}