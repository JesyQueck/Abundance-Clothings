export type Category = "mens" | "womens" | "accessories";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type OrderStatus =
  | "Received"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Delivered";

export interface ProductVariant {
  size: Size;
  color: string;
  colorHex: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Category;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  material: string;
  care: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: Size;
  color: string;
  colorHex: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiry: string;
  usageCount: number;
  active: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  deliveryAddress: string;
  state: string;
  city: string;
  orderNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: "Received" | "Processing" | "Packed" | "Shipped" | "Delivered";
  createdAt: string;
}
