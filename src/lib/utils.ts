import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function getStockStatus(stock: number): "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" {
  if (stock === 0) return "OUT OF STOCK";
  if (stock <= 5) return "LOW STOCK";
  return "IN STOCK";
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case "IN STOCK":
      return "text-green-500";
    case "LOW STOCK":
      return "text-yellow-500";
    case "OUT OF STOCK":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}
