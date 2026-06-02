import { CartItem } from "@/types";

export interface OrderDetails {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  state: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
}

export function buildWhatsAppMessage(details: OrderDetails): string {
  const { customerName, phone, email, address, state, notes, items, subtotal, discount, couponCode, total } = details;

  let message = `🛍️ NEW ORDER — Abundance Clothing\n\n`;
  message += `👤 Customer: ${customerName}\n`;
  message += `📞 Phone: ${phone}\n`;
  message += `📍 Address: ${address}, ${state}\n`;
  if (email) message += `📧 Email: ${email}\n`;
  message += `\n🧾 ORDER DETAILS:\n`;

  items.forEach((item) => {
    message += `\n• ${item.name}\n`;
    message += `  Size: ${item.size} | Color: ${item.color}\n`;
    message += `  Qty: ${item.quantity} × ₦${item.price.toLocaleString()} = ₦${(item.quantity * item.price).toLocaleString()}\n`;
  });

  message += `\n─────────────────────\n`;
  message += `Subtotal:   ₦${subtotal.toLocaleString()}\n`;
  if (discount > 0) {
    message += `Discount:   -₦${discount.toLocaleString()} (${couponCode})\n`;
  }
  message += `TOTAL:      ₦${total.toLocaleString()}\n`;
  message += `─────────────────────\n`;

  if (notes) {
    message += `\n📝 Notes: ${notes}\n`;
  }

  message += `\nSent via abundanceclothing.com`;

  return encodeURIComponent(message);
}

export function getWhatsAppURL(message: string): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "2348000000000";
  return `https://wa.me/${phoneNumber}?text=${message}`;
}
