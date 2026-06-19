import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Erro ao listar buckets:", listError.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
      ],
    });
    if (error) {
      console.error("Erro ao criar bucket:", error.message);
      process.exit(1);
    }
    console.log("Bucket criado:", BUCKET);
  } else {
    const { error } = await supabase.storage.updateBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
      ],
    });
    if (error) {
      console.warn("Aviso ao atualizar bucket:", error.message);
    } else {
      console.log("Bucket ja existe, configuracao atualizada:", BUCKET);
    }
  }

  const testName = `setup-test-${Date.now()}.jpg`;
  const tinyJpeg = Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
    "base64"
  );
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(`_test/${testName}`, tinyJpeg, { contentType: "image/jpeg" });

  if (uploadError) {
    console.error("Teste de upload falhou:", uploadError.message);
    console.error("Rode supabase-storage.sql no SQL Editor do Supabase.");
    process.exit(1);
  }

  await supabase.storage.from(BUCKET).remove([`_test/${testName}`]);
  console.log("Teste de upload: OK");
}

main();