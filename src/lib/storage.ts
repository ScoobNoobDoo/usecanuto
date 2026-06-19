import { getSupabase } from "@/lib/supabase";

const BUCKET = "product-images";

export function getStoragePublicUrl(path: string) {
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
  contentType: string
) {
  const path = `products/${filename}`;
  const { error } = await getSupabase().storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });

  if (error) throw new Error(error.message);
  return getStoragePublicUrl(path);
}