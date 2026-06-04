import { Product } from "@/types";

/** Shown on the homepage when Supabase has no featured products. */
export const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    id: "mock-focus-tee",
    slug: "abundance-focus-tee",
    name: "Abundance Focus Tee",
    description: "Premium cotton tee with gold logo print.",
    price: 18500,
    category: "mens",
    tags: ["streetwear", "tee"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    ],
    material: "100% Cotton",
    care: ["Machine wash cold", "Do not bleach"],
    featured: true,
    published: true,
    createdAt: new Date().toISOString(),
    variants: [
      { size: "M", color: "Black", colorHex: "#0D0B09", stock: 24 },
      { size: "L", color: "Black", colorHex: "#0D0B09", stock: 18 },
    ],
  },
  {
    id: "mock-flourish-hoodie",
    slug: "flourish-oversized-hoodie",
    name: "Flourish Oversized Hoodie",
    description: "Heavyweight fleece hoodie for everyday wear.",
    price: 42000,
    salePrice: 38500,
    category: "mens",
    tags: ["hoodie", "winter"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    material: "80% Cotton, 20% Polyester",
    care: ["Machine wash cold", "Tumble dry low"],
    featured: true,
    published: true,
    createdAt: new Date().toISOString(),
    variants: [
      { size: "M", color: "Charcoal", colorHex: "#2A2520", stock: 12 },
      { size: "XL", color: "Charcoal", colorHex: "#2A2520", stock: 8 },
    ],
  },
  {
    id: "mock-gold-cap",
    slug: "gold-crest-cap",
    name: "Gold Crest Cap",
    description: "Structured cap with embroidered crest.",
    price: 12000,
    category: "accessories",
    tags: ["cap", "accessories"],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
    ],
    material: "Cotton twill",
    care: ["Spot clean only"],
    featured: true,
    published: true,
    createdAt: new Date().toISOString(),
    variants: [
      { size: "M", color: "Gold", colorHex: "#C8A84B", stock: 30 },
    ],
  },
];

export function isMockProduct(product: Product): boolean {
  return product.id.startsWith("mock-");
}
