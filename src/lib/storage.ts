import { supabase } from "@/lib/db";

export const PRODUCT_IMAGES_BUCKET = "product-images";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateProductImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Use JPG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "Each image must be under 5MB.";
  }
  return null;
}

export async function uploadProductImage(
  file: File,
  productSlug: string,
): Promise<string> {
  const err = validateProductImage(file);
  if (err) throw new Error(err);

  const safeSlug = productSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "product";
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${safeSlug}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(error.message || "Failed to upload image.");
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImages(
  files: File[],
  productSlug: string,
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadProductImage(file, productSlug));
  }
  return urls;
}
