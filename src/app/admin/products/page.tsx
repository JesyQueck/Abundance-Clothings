"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProductFormModal,
  ProductFormValues,
} from "@/components/admin/ProductFormModal";
import { Button } from "@/components/ui/Button";
import { SectionTitle, SubTitle, Card, Badge } from "@/components/ui/PRDComponents";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  updateProductFlags,
} from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("abundance_admin_auth");
    if (auth !== "true") {
      router.push("/admin-login");
    } else {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, [router, loadProducts]);

  const totalStock = (p: Product) =>
    p.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;

  const handleSave = async (values: ProductFormValues) => {
    if (editing) {
      await updateProduct({ ...values, id: editing.id, createdAt: editing.createdAt });
    } else {
      await addProduct(values);
    }
    await loadProducts();
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch {
      alert("Failed to delete product.");
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await updateProductFlags(product.id, { featured: !product.featured });
      await loadProducts();
    } catch {
      alert("Failed to update featured status.");
    }
  };

  const togglePublished = async (product: Product) => {
    try {
      await updateProductFlags(product.id, { published: !product.published });
      await loadProducts();
    } catch {
      alert("Failed to update published status.");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SectionTitle>Product Management</SectionTitle>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Add Product
        </Button>
      </div>

      <p className="mb-6 text-lg leading-relaxed">
        Create and edit products, manage stock variants, and mark items as{" "}
        <span className="text-gold-primary">featured</span> to show on the homepage.
      </p>

      <SubTitle>
        All Products ({products.length})
      </SubTitle>

      {loading ? (
        <p className="text-text-muted">Loading products…</p>
      ) : products.length === 0 ? (
        <Card>
          <p className="mb-4">No products yet. Add your first product to get started.</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <div
                className="h-44 w-full bg-cover bg-center rounded-sm mb-3"
                style={{
                  backgroundImage: `url(${p.images?.[0] ?? ""})`,
                  backgroundColor: "#1c1915",
                }}
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {p.featured && <Badge type="gold">Featured</Badge>}
                {!p.published && <Badge type="red">Draft</Badge>}
                <Badge type="blue">{p.category}</Badge>
              </div>
              <h3 className="font-display text-lg tracking-wider text-text-primary">
                {p.name}
              </h3>
              <p className="text-sm text-text-muted font-mono">{p.slug}</p>
              <p className="text-gold-primary mt-1">
                {p.salePrice != null ? (
                  <>
                    <span className="line-through text-text-muted mr-2">
                      {formatPrice(p.price)}
                    </span>
                    {formatPrice(p.salePrice)}
                  </>
                ) : (
                  formatPrice(p.price)
                )}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Stock: {totalStock(p)} · {p.variants.length} variant(s)
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleFeatured(p)}
                  className="px-2 py-1 text-xs bg-background-raised border border-border-subtle text-gold-primary"
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => togglePublished(p)}
                  className="px-2 py-1 text-xs bg-background-raised border border-border-subtle"
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(p);
                    setModalOpen(true);
                  }}
                  className="px-2 py-1 text-xs bg-background-raised border border-border-subtle"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="px-2 py-1 text-xs bg-background-raised border border-border-subtle text-red-400"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  );
}
