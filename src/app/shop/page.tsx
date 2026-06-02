"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProducts, getProductsByCategory, searchProducts } from "@/lib/db";
import { Product } from "@/types";
import { Category } from "@/types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      let result: Product[];
      
      if (category === "all") {
        result = await getProducts();
      } else {
        result = await getProductsByCategory(category);
      }
      
      if (searchQuery) {
        result = await searchProducts(searchQuery);
      }
      
      setProducts(result);
      setLoading(false);
    };

    loadProducts();
  }, [category, searchQuery]);

  return (
    <div className="bg-background-deep min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-5xl tracking-widest text-center mb-8">
          <span className="text-gold-primary">SHOP</span>
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                category === "all"
                  ? "bg-gold-primary text-background-deep"
                  : "bg-background-raised border border-border-subtle text-text-secondary hover:border-gold-primary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategory("mens")}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                category === "mens"
                  ? "bg-gold-primary text-background-deep"
                  : "bg-background-raised border border-border-subtle text-text-secondary hover:border-gold-primary"
              }`}
            >
              Men&apos;s
            </button>
            <button
              onClick={() => setCategory("womens")}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                category === "womens"
                  ? "bg-gold-primary text-background-deep"
                  : "bg-background-raised border border-border-subtle text-text-secondary hover:border-gold-primary"
              }`}
            >
              Women&apos;s
            </button>
            <button
              onClick={() => setCategory("accessories")}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                category === "accessories"
                  ? "bg-gold-primary text-background-deep"
                  : "bg-background-raised border border-border-subtle text-text-secondary hover:border-gold-primary"
              }`}
            >
              Accessories
            </button>
          </div>

          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="bg-background-raised border border-border-subtle overflow-hidden">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.salePrice && (
                      <span className="absolute top-2 right-2 bg-gold-primary text-background-deep text-xs px-2 py-1 font-mono uppercase">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg tracking-wider text-text-primary mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-text-secondary text-sm">
                        ₦{product.price.toLocaleString()}
                      </p>
                      {product.salePrice && (
                        <p className="text-red-500 text-sm line-through">
                          ₦{product.salePrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
