import { getSupabase } from "@/lib/supabase";

const BUCKET = "product-images";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

export function resolveImageExt(file: { name: string; type: string }) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return MIME_TO_EXT[file.type] || "jpg";
}

export function resolveContentType(ext: string, fallback?: string) {
  if (fallback) return fallback;
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
  };
  return map[ext] || "image/jpeg";
}

let bucketReady = false;

export async function ensureStorageBucket() {
  if (bucketReady) return;

  const supabase = getSupabase();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: Object.keys(MIME_TO_EXT),
    });
    if (error) throw new Error(`Bucket: ${error.message}`);
  }

  bucketReady = true;
}

export function getStoragePublicUrl(path: string) {
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
  contentType: string
) {
  await ensureStorageBucket();

  const path = `products/${filename}`;
  const { error } = await getSupabase().storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
    cacheControl: "3600",
  });

  if (error) throw new Error(error.message);
  return getStoragePublicUrl(path);
}