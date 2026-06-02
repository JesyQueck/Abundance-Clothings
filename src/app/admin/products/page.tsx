"use client";

import React, { useEffect, useState } from "react";
import { SectionTitle, Card } from "@/components/ui/PRDComponents";
import { getAllProducts } from "@/lib/db";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getAllProducts();
      setProducts(data);
    })();
  }, []);

  const totalStock = (p: Product) => {
    return p.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Product Management</SectionTitle>
      <p className="mb-6 text-lg">
        Phase 1 mock: products stored in localStorage. This is a simplified
        admin view for builds.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="p-4 border border-border-subtle rounded">
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${p.images?.[0] ?? ""})` }}
            />
            <div className="mt-2 font-semibold">{p.name}</div>
            <div className="text-sm text-text-secondary">{p.category}</div>
            <div className="text-gold-primary mt-1">₦{p.price}</div>
            <div className="text-xs text-text-secondary mt-1">
              Stock: {totalStock(p)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
