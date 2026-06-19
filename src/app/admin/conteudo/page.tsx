import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { fetchSiteContent } from "@/lib/data";
import SiteContentEditor from "@/components/admin/SiteContentEditor";

export const dynamic = "force-dynamic";

export default async function ConteudoAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const content = await fetchSiteContent();

  return <SiteContentEditor initial={content} />;
}