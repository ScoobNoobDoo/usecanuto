import { NextResponse } from "next/server";
import { countProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await countProducts();
    return NextResponse.json({
      ok: true,
      database: "supabase",
      products: count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        message,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!(
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ),
      },
      { status: 500 }
    );
  }
}