import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { fetchAdminById } from "@/lib/data";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const admin = await fetchAdminById(session.id);
  return NextResponse.json({ authenticated: true, admin });
}