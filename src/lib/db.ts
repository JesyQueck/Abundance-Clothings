import { Product, Coupon, Order, CartItem, Category } from "@/types";
import products from "@/data/products.json";
import coupons from "@/data/coupons.json";

// Mock DB layer - designed to be easily swapped with Supabase in Phase 2

// Type assertions for JSON imports
const typedProducts = products as Product[];
const typedCoupons = coupons as Coupon[];

// Products
export async function getProducts(
  includeUnpublished = false,
): Promise<Product[]> {
  if (includeUnpublished) return typedProducts;
  return typedProducts.filter((p) => p.published);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return typedProducts.find((p) => p.slug === slug && p.published) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return typedProducts.find((p) => p.id === id) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return typedProducts.filter((p) => p.featured && p.published);
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  return typedProducts.filter((p) => p.category === category && p.published);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  return typedProducts.filter(
    (p) =>
      p.published &&
      (p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)),
  );
}

// Admin product management (localStorage)
export async function getAllProducts(): Promise<Product[]> {
  const stored = localStorage.getItem("abundance_products");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("abundance_products", JSON.stringify(typedProducts));
  return typedProducts;
}

export async function addProduct(product: Product): Promise<void> {
  const all = await getAllProducts();
  all.push(product);
  localStorage.setItem("abundance_products", JSON.stringify(all));
}

export async function updateProduct(product: Product): Promise<void> {
  const all = await getAllProducts();
  const index = all.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    all[index] = product;
  }
  localStorage.setItem("abundance_products", JSON.stringify(all));
}

export async function deleteProduct(id: string): Promise<void> {
  const all = await getAllProducts();
  const filtered = all.filter((p) => p.id !== id);
  localStorage.setItem("abundance_products", JSON.stringify(filtered));
}

// Coupons
export async function getCoupons(): Promise<Coupon[]> {
  const stored = localStorage.getItem("abundance_coupons");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("abundance_coupons", JSON.stringify(typedCoupons));
  return typedCoupons;
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const all = await getCoupons();
  return (
    all.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active) ||
    null
  );
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const all = await getCoupons();
  const index = all.findIndex((c) => c.code === coupon.code);
  if (index >= 0) {
    all[index] = coupon;
  } else {
    all.push(coupon);
  }
  localStorage.setItem("abundance_coupons", JSON.stringify(all));
}

export async function deleteCoupon(code: string): Promise<void> {
  const all = await getCoupons();
  const filtered = all.filter((c) => c.code !== code);
  localStorage.setItem("abundance_coupons", JSON.stringify(filtered));
}

// Orders (localStorage for Phase 1)
export async function getOrders(): Promise<Order[]> {
  const stored = localStorage.getItem("abundance_orders");
  return stored ? JSON.parse(stored) : [];
}

export async function saveOrder(order: Order): Promise<void> {
  const all = await getOrders();
  all.unshift(order);
  localStorage.setItem("abundance_orders", JSON.stringify(all));
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<void> {
  const all = await getOrders();
  const order = all.find((o) => o.id === id);
  if (order) {
    order.status = status;
    localStorage.setItem("abundance_orders", JSON.stringify(all));
  }
}

// Newsletter
export function getNewsletterSignups(): string[] {
  const stored = localStorage.getItem("abundance_newsletter");
  return stored ? JSON.parse(stored) : [];
}

export async function addNewsletterEmail(email: string): Promise<void> {
  const all = getNewsletterSignups();
  if (!all.includes(email)) {
    all.push(email);
    localStorage.setItem("abundance_newsletter", JSON.stringify(all));
  }
}
