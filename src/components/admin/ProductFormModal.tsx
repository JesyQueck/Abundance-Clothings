"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  parseCommaList,
  parseLines,
  slugify,
} from "@/lib/productUtils";
import { Category, Product, ProductVariant, Size } from "@/types";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES: Category[] = ["mens", "womens", "accessories"];

const emptyVariant = (): ProductVariant => ({
  size: "M",
  color: "Black",
  colorHex: "#0D0B09",
  stock: 10,
});

export type ProductFormValues = Omit<Product, "id" | "createdAt">;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormValues) => Promise<void>;
  initial?: Product | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: ProductFormModalProps) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState<Category>("mens");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState("");
  const [material, setMaterial] = useState("");
  const [care, setCare] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [variants, setVariants] = useState<ProductVariant[]>([emptyVariant()]);

  useEffect(() => {
    if (!isOpen) return;
    if (initial) {
      setName(initial.name);
      setSlug(initial.slug);
      setSlugManual(true);
      setDescription(initial.description);
      setPrice(String(initial.price));
      setSalePrice(initial.salePrice != null ? String(initial.salePrice) : "");
      setCategory(initial.category);
      setTags(initial.tags.join(", "));
      setImages(initial.images.join(", "));
      setMaterial(initial.material);
      setCare(initial.care.join("\n"));
      setFeatured(initial.featured);
      setPublished(initial.published);
      setVariants(
        initial.variants.length > 0 ? initial.variants : [emptyVariant()],
      );
    } else {
      setName("");
      setSlug("");
      setSlugManual(false);
      setDescription("");
      setPrice("");
      setSalePrice("");
      setCategory("mens");
      setTags("");
      setImages("");
      setMaterial("");
      setCare("");
      setFeatured(false);
      setPublished(true);
      setVariants([emptyVariant()]);
    }
  }, [isOpen, initial]);

  useEffect(() => {
    if (!slugManual && name) setSlug(slugify(name));
  }, [name, slugManual]);

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !price) {
      alert("Name, slug, and price are required.");
      return;
    }
    const imageList = parseCommaList(images);
    if (imageList.length === 0) {
      alert("Add at least one image URL.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        category,
        tags: parseCommaList(tags),
        images: imageList,
        material: material.trim(),
        care: parseLines(care),
        featured,
        published,
        variants,
      });
      onClose();
    } catch {
      alert("Failed to save product. Check Supabase RLS policies allow writes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h2 className="font-display text-2xl tracking-widest text-text-primary pr-8">
          {initial ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              required
            />
          </Field>
          <Field label="Price (₦)">
            <input
              type="number"
              min={0}
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Field>
          <Field label="Sale price (optional)">
            <input
              type="number"
              min={0}
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Material">
            <input
              className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className="w-full px-3 py-2 min-h-[80px] bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field label="Image URLs (comma-separated)">
          <input
            className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            className="w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Field>

        <Field label="Care instructions (one per line)">
          <textarea
            className="w-full px-3 py-2 min-h-[60px] bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none"
            value={care}
            onChange={(e) => setCare(e.target.value)}
          />
        </Field>

        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured on homepage
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published in shop
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-text-secondary">Variants</span>
            <button
              type="button"
              className="text-xs text-gold-primary"
              onClick={() => setVariants((v) => [...v, emptyVariant()])}
            >
              + Add variant
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {variants.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-2 items-center border border-border-subtle p-2"
              >
                <select
                  className="w-full px-2 py-1 bg-background-raised border border-border-subtle text-text-primary text-xs focus:border-gold-primary focus:outline-none"
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(i, "size", e.target.value as Size)
                  }
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  className="w-full px-2 py-1 bg-background-raised border border-border-subtle text-text-primary text-xs focus:border-gold-primary focus:outline-none"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                />
                <input
                  className="w-full px-2 py-1 bg-background-raised border border-border-subtle text-text-primary text-xs focus:border-gold-primary focus:outline-none"
                  placeholder="#hex"
                  value={v.colorHex}
                  onChange={(e) => updateVariant(i, "colorHex", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  className="w-full px-2 py-1 bg-background-raised border border-border-subtle text-text-primary text-xs focus:border-gold-primary focus:outline-none"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() =>
                    setVariants((prev) =>
                      prev.length > 1 ? prev.filter((_, j) => j !== i) : prev,
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
            {saving ? "Saving…" : initial ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-mono text-text-secondary mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
