import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { fetchAllProductsAdmin } from "@/lib/data";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = await fetchAllProductsAdmin();

  return (
    <AdminDashboard products={products} adminEmail={session.email} />
  );
}