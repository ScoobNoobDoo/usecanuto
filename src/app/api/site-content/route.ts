import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fetchSiteContent, updateSiteContent } from "@/lib/data";
import { mergeSiteContent, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await fetchSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const content = mergeSiteContent(body as Partial<SiteContent>);
    await updateSiteContent(content);
    return NextResponse.json(content);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}