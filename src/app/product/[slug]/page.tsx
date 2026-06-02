"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { getProductBySlug } from "@/lib/db";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingBag } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        if (data.variants.length > 0) {
          setSelectedSize(data.variants[0].size);
          setSelectedColor(data.variants[0].color);
        }
      }
      setLoading(false);
    };

    loadProduct();
  }, [slug]);

  const selectedVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Product not found.</p>
      </div>
    );
  }

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <div className="bg-background-deep min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-background-raised mb-4 overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-background-raised overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-gold-primary" : "border-border-subtle"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-widest mb-4">
              {product.name}
            </h1>
            
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-display text-gold-primary">
                ₦{(product.salePrice || product.price).toLocaleString()}
              </p>
              {product.salePrice && (
                <p className="text-xl text-text-muted line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
            </div>

            <div className="prose prose-invert prose-sm mb-6 text-text-secondary">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border transition-colors ${
                      selectedSize === size
                        ? "border-gold-primary bg-gold-primary text-background-deep"
                        : "border-border-subtle bg-background-raised text-text-secondary hover:border-gold-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {uniqueColors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        selectedColor === color ? "border-gold-primary" : "border-border-subtle"
                      }`}
                      style={{ backgroundColor: variant?.colorHex }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="mb-6">
                {selectedVariant.stock > 0 ? (
                  <p className="text-green-500 text-sm">
                    In Stock ({selectedVariant.stock} available)
                  </p>
                ) : (
                  <p className="text-red-500 text-sm">Out of Stock</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-background-raised border border-border-subtle text-text-primary hover:border-gold-primary transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-background-raised border border-border-subtle text-text-primary hover:border-gold-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <ShoppingBag className="mr-2" size={20} />
                Add to Cart
              </Button>
              <button
                onClick={handleAddToWishlist}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  isInWishlist(product.id)
                    ? "border-gold-primary bg-gold-primary text-background-deep"
                    : "border-border-subtle bg-background-raised text-text-primary hover:border-gold-primary"
                }`}
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border-subtle pt-6 space-y-4 text-sm text-text-secondary">
              <div>
                <span className="font-mono uppercase tracking-wider text-text-muted">Category:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="font-mono uppercase tracking-wider text-text-muted">SKU:</span>
                <span className="ml-2">{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
