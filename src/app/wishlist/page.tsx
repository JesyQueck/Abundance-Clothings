"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice, getStockStatusColor } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";
import { Heart, X } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gold-primary">
        <h1 className="text-4xl font-bebas-neue mb-4">Your Wishlist is Empty</h1>
        <p className="text-lg text-text-secondary mb-8">
          Save your favorite items here to easily find them later.
        </p>
        <Link href="/shop">
          <Button variant="primary">Discover Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bebas-neue text-gold-primary mb-8 text-center">Your Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <Card key={product.id}>
            <div className="relative w-full h-60 mb-4">
              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} className="rounded-md" />
              <Button
                variant="icon"
                size="small"
                className="absolute top-2 right-2 bg-background-surface rounded-full"
                onClick={() => removeFromWishlist(product.id)}
              >
                <X size={16} className="text-gold-primary" />
              </Button>
            </div>
            <Link href={`/product/${product.slug}`}>
              <h2 className="text-xl font-bebas-neue text-text-primary hover:text-gold-primary transition-colors mb-2 line-clamp-1">
                {product.name}
              </h2>
            </Link>
            <p className="text-gold-primary text-lg font-mono mb-2">
              ₦{formatPrice(product.price)}
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {product.variants.map(variant => variant.size).filter((value, index, self) => self.indexOf(value) === index).map(size => (
                <Tag key={size}>{size}</Tag>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-mono uppercase ${getStockStatusColor(product)}`}>
                {product.variants.reduce((sum, v) => sum + v.stock, 0) > 0 ? "In Stock" : "Out of Stock"}
              </span>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  // For simplicity, add the first available variant to cart
                  const firstVariant = product.variants.find(v => v.stock > 0);
                  if (firstVariant) {
                    addToCart({ ...product, selectedSize: firstVariant.size, selectedColor: firstVariant.color, quantity: 1 });
                  }
                }}
                disabled={product.variants.reduce((sum, v) => sum + v.stock, 0) === 0}
              >
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
