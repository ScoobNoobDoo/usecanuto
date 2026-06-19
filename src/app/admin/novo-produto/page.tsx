import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminWizard from "@/components/admin/AdminWizard";

export default async function NovoProdutoPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl tracking-wide">Novo Anúncio</h1>
        <p className="text-sm text-muted mt-2">
          Cadastre uma nova peça seguindo as etapas abaixo
        </p>
      </div>
      <AdminWizard />
    </div>
  );
}