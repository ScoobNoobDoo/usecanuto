import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.id },
    select: { name: true, email: true },
  });

  return NextResponse.json({ authenticated: true, admin });
}