import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadProductImage } from "@/lib/storage";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif"];

async function uploadLocal(buffer: Buffer, ext: string) {
  const filename = `${uuidv4()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (máx. 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json({ error: "Formato não suportado" }, { status: 400 });
    }

    const filename = `${uuidv4()}.${ext}`;
    const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;

    try {
      const url = await uploadProductImage(buffer, filename, contentType);
      return NextResponse.json({ url, storage: "supabase" });
    } catch (storageError) {
      if (process.env.NODE_ENV === "production") {
        const msg = storageError instanceof Error ? storageError.message : "Erro no storage";
        return NextResponse.json(
          {
            error: `Upload falhou. Execute supabase-storage.sql no Supabase. (${msg})`,
          },
          { status: 500 }
        );
      }
      const url = await uploadLocal(buffer, ext);
      return NextResponse.json({ url, storage: "local" });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}