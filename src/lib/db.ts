import { createClient } from "@supabase/supabase-js";
import {
  Product,
  Coupon,
  Order,
  CartItem,
  Category,
  OrderStatus,
  ProductVariant,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to transform Supabase snake_case to camelCase for product variants
const transformProductVariant = (variant: any): ProductVariant => ({
  size: variant.size,
  color: variant.color,
  colorHex: variant.color_hex,
  stock: variant.stock,
});

// Helper to transform Supabase snake_case to camelCase for products
const transformProduct = (product: any): Product => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  description: product.description,
  price: parseFloat(product.price),
  salePrice: product.sale_price ? parseFloat(product.sale_price) : undefined,
  category: product.category as Category,
  tags: product.tags || [],
  images: product.images || [],
  material: product.material,
  care: product.care || [],
  featured: product.featured,
  published: product.published,
  createdAt: product.created_at,
  variants: product.product_variants
    ? product.product_variants.map((v: any) => transformProductVariant(v))
    : [],
});

// Helper to transform Supabase snake_case to camelCase for order items
const transformOrderItem = (item: any): CartItem => ({
  productId: item.product_id,
  slug: item.product_slug, // Assuming slug is stored if needed
  name: item.product_name,
  image: item.product_image,
  size: item.size,
  color: item.color,
  colorHex: item.color_hex, // Assuming hex is stored if needed
  quantity: item.quantity,
  price: parseFloat(item.unit_price),
});

// Helper to transform Supabase snake_case to camelCase for orders
const transformOrder = (order: any): Order => ({
  id: order.id,
  customerName: order.customer_name,
  phoneNumber: order.phone_number,
  email: order.email,
  deliveryAddress: order.delivery_address,
  state: order.state,
  city: order.city,
  orderNotes: order.order_notes,
  subtotal: parseFloat(order.subtotal),
  discount: parseFloat(order.discount),
  couponCode: order.coupon_code,
  total: parseFloat(order.total),
  status: order.status as OrderStatus,
  createdAt: order.created_at,
  items: order.order_items ? order.order_items.map(transformOrderItem) : [],
});

// --- Product Operations ---

export async function getProducts(
  includeUnpublished = false,
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data.map(transformProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 means no rows found
    console.error("Error fetching product by slug:", error);
    return null;
  }
  return data ? transformProduct(data) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching product by id:", error);
    return null;
  }
  return data ? transformProduct(data) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
  return data.map(transformProduct);
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("category", category)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
  return data.map(transformProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .filter("published", "eq", true)
    .or(
      `name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query.split(" ").join(",")}}`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }
  return data.map(transformProduct);
}

// --- Admin Product Management (Supabase) ---

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
  return data.map(transformProduct);
}

export async function addProduct(product: Product): Promise<void> {
  const { variants, ...productData } = product;
  const { data, error } = await supabase
    .from("products")
    .insert({ ...productData, created_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error adding product:", error);
    throw error;
  }

  if (data && variants && variants.length > 0) {
    const variantsToInsert = variants.map((v: ProductVariant) => ({
      size: v.size,
      color: v.color,
      color_hex: v.colorHex,
      stock: v.stock,
      product_id: data.id,
    }));
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantsToInsert);
    if (variantError) {
      console.error("Error adding product variants:", variantError);
      throw variantError;
    }
  }
}

export async function updateProduct(product: Product): Promise<void> {
  const { variants, ...productData } = product;
  const { error } = await supabase
    .from("products")
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq("id", product.id);

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  // Update variants: clear existing and insert new ones
  await supabase.from("product_variants").delete().eq("product_id", product.id);
  if (variants && variants.length > 0) {
    const variantsToInsert = variants.map((v: ProductVariant) => ({
      size: v.size,
      color: v.color,
      color_hex: v.colorHex,
      stock: v.stock,
      product_id: product.id,
    }));
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantsToInsert);
    if (variantError) {
      console.error("Error updating product variants:", variantError);
      throw variantError;
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// --- Coupon Operations ---

export async function getCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
  return data.map((c) => ({
    ...c,
    value: parseFloat(c.value),
    expiry: c.expiry ? new Date(c.expiry).toISOString() : "",
    usageCount: c.usage_count,
  }));
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching coupon by code:", error);
    return null;
  }
  if (!data) return null;
  return {
    ...data,
    value: parseFloat(data.value),
    expiry: data.expiry ? new Date(data.expiry).toISOString() : "",
    usageCount: data.usage_count,
  };
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const { usageCount, ...couponData } = coupon;
  const { error } = await supabase
    .from("coupons")
    .upsert(
      {
        ...couponData,
        usage_count: usageCount,
        expiry: new Date(coupon.expiry).toISOString(),
      },
      { onConflict: "code" },
    );
  if (error) {
    console.error("Error saving coupon:", error);
    throw error;
  }
}

export async function deleteCoupon(code: string): Promise<void> {
  const { error } = await supabase.from("coupons").delete().eq("code", code);
  if (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
}

// --- Order Operations ---

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data.map(transformOrder);
}

export async function saveOrder(order: Order): Promise<void> {
  const { items, ...orderData } = order;
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...orderData, created_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error saving order:", error);
    throw error;
  }

  if (data && items && items.length > 0) {
    const itemsToInsert = items.map((item) => ({
      order_id: data.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.price,
    }));
    const { error: itemError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);
    if (itemError) {
      console.error("Error saving order items:", itemError);
      throw itemError;
    }
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// --- Newsletter Operations ---

export async function getNewsletterSignups(): Promise<string[]> {
  const { data, error } = await supabase
    .from("newsletter_signups")
    .select("email");
  if (error) {
    console.error("Error fetching newsletter signups:", error);
    return [];
  }
  return data.map((item) => item.email);
}

export async function addNewsletterEmail(email: string): Promise<void> {
  const { error } = await supabase.from("newsletter_signups").insert({ email });
  if (error) {
    console.error("Error adding newsletter email:", error);
    throw error;
  }
}
