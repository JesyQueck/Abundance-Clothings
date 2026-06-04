import { Product } from "@/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productToDbRow(
  product: Pick<
    Product,
    | "slug"
    | "name"
    | "description"
    | "price"
    | "salePrice"
    | "category"
    | "tags"
    | "images"
    | "material"
    | "care"
    | "featured"
    | "published"
  >,
) {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    sale_price: product.salePrice ?? null,
    category: product.category,
    tags: product.tags,
    images: product.images,
    material: product.material,
    care: product.care,
    featured: product.featured,
    published: product.published,
  };
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
