"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProducts } from "@/lib/db";
import { Product, Category } from "@/types";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<
    "newest" | "price-asc" | "price-desc" | "popular"
  >("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setLoading(false);
    })();
  }, []);

  // derive available sizes and colors from products
  const availableSizes = useMemo(() => {
    const s = new Set<string>();
    allProducts.forEach((p) => p.variants.forEach((v) => s.add(v.size)));
    return Array.from(s);
  }, [allProducts]);

  const availableColors = useMemo(() => {
    const s = new Set<string>();
    allProducts.forEach((p) => p.variants.forEach((v) => s.add(v.color)));
    return Array.from(s);
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = allProducts.slice();

    if (category !== "all") list = list.filter((p) => p.category === category);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) => selectedSizes.includes(v.size)),
      );
    }

    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) => selectedColors.includes(v.color)),
      );
    }

    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    if (minPrice !== "") {
      list = list.filter((p) => (p.salePrice ?? p.price) >= Number(minPrice));
    }
    if (maxPrice !== "") {
      list = list.filter((p) => (p.salePrice ?? p.price) <= Number(maxPrice));
    }

    // sorting
    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "popular":
        // popularity is not tracked in mock data; keep as-is
        break;
    }

    return list;
  }, [
    allProducts,
    category,
    searchQuery,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    inStockOnly,
    sort,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSort("newest");
  };

  return (
    <div className="bg-background-deep min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-5xl tracking-widest">
            <span className="text-gold-primary">SHOP</span>
          </h1>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="p-2 bg-background-raised border border-border-subtle text-text-primary"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            <button
              className="md:hidden px-3 py-2 bg-background-raised border border-border-subtle text-text-primary"
              onClick={() => setFiltersOpen((s) => !s)}
            >
              Filters
            </button>

            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`${filtersOpen ? "block" : "hidden md:block"} md:col-span-1 bg-background-raised p-4 border border-border-subtle`}
          >
            <h3 className="text-sm font-mono text-text-secondary mb-3">
              Filters
            </h3>

            <div className="mb-4">
              <div className="text-xs text-text-muted mb-2">Category</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`text-left p-2 ${category === "all" ? "text-gold-primary" : "text-text-secondary"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategory("mens")}
                  className={`text-left p-2 ${category === "mens" ? "text-gold-primary" : "text-text-secondary"}`}
                >
                  Men's
                </button>
                <button
                  onClick={() => setCategory("womens")}
                  className={`text-left p-2 ${category === "womens" ? "text-gold-primary" : "text-text-secondary"}`}
                >
                  Women's
                </button>
                <button
                  onClick={() => setCategory("accessories")}
                  className={`text-left p-2 ${category === "accessories" ? "text-gold-primary" : "text-text-secondary"}`}
                >
                  Accessories
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-text-muted mb-2">Size</div>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-3 py-1 border ${selectedSizes.includes(s) ? "bg-gold-primary text-background-deep" : "bg-background-raised text-text-secondary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-text-muted mb-2">Color</div>
              <div className="flex gap-2 flex-wrap">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    title={c}
                    className={`w-8 h-8 rounded-full border ${selectedColors.includes(c) ? "ring-2 ring-gold-primary" : "border-border-subtle"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-text-muted mb-2">Price (₦)</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice as any}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-1/2 p-2 bg-background-surface border border-border-subtle"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice as any}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-1/2 p-2 bg-background-surface border border-border-subtle"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span className="text-xs text-text-secondary">
                  In stock only
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-2 border border-border-subtle"
              >
                Reset
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="px-3 py-2 bg-gold-primary text-background-deep"
              >
                Apply
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group"
                  >
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
                            ₦
                            {(
                              product.salePrice ?? product.price
                            ).toLocaleString()}
                          </p>
                          {product.salePrice && (
                            <p className="text-red-500 text-sm line-through">
                              ₦{product.price.toLocaleString()}
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
      </div>
    </div>
  );
}
