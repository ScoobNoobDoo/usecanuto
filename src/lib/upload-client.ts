export async function uploadImageFiles(files: FileList | File[]) {
  const urls: string[] = [];
  let error = "";

  for (const file of Array.from(files)) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
      credentials: "include",
    });

    const data = await res.json();
    if (data.url) {
      urls.push(data.url);
    } else if (data.error) {
      error = data.error;
    }
  }

  return { urls, error };
}

export const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/*";