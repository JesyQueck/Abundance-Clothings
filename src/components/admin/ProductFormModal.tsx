"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  ProductImageUpload,
  ProductImageItem,
} from "@/components/admin/ProductImageUpload";
import { parseCommaList, parseLines, slugify } from "@/lib/productUtils";
import { uploadProductImages } from "@/lib/storage";
import { Category, Product, ProductVariant, Size } from "@/types";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES: Category[] = ["mens", "womens", "accessories"];

const emptyVariant = (): ProductVariant => ({
  size: "M",
  color: "Black",
  colorHex: "#0D0B09",
  stock: 10,
});

const inputClass =
  "w-full px-3 py-2 bg-background-raised border border-border-subtle text-text-primary text-sm focus:border-gold-primary focus:outline-none";

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
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState<Category>("mens");
  const [tags, setTags] = useState("");
  const [imageItems, setImageItems] = useState<ProductImageItem[]>([]);
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
      setImageItems(
        initial.images.map((url) => ({
          previewUrl: url,
          isExisting: true,
        })),
      );
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
      setImageItems([]);
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

  const resolveImageUrls = async (): Promise<string[]> => {
    const productSlug = slug.trim() || slugify(name) || "product";
    const existingUrls = imageItems
      .filter((item) => !item.file)
      .map((item) => item.previewUrl);
    const pendingFiles = imageItems
      .filter((item): item is ProductImageItem & { file: File } => !!item.file)
      .map((item) => item.file);

    if (pendingFiles.length === 0) return existingUrls;

    setUploading(true);
    try {
      const uploaded = await uploadProductImages(pendingFiles, productSlug);
      return [...existingUrls, ...uploaded];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !price) {
      alert("Name, slug, and price are required.");
      return;
    }
    if (imageItems.length === 0) {
      alert("Add at least one product image.");
      return;
    }

    setSaving(true);
    try {
      const images = await resolveImageUrls();
      await onSave({
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        category,
        tags: parseCommaList(tags),
        images,
        material: material.trim(),
        care: parseLines(care),
        featured,
        published,
        variants,
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save product.";
      alert(
        `${message}\n\nIf uploads fail, run supabase/storage-product-images.sql in your Supabase project.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || uploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={initial ? "Edit Product" : "Add Product"}
      footer={
        <div className="flex gap-3">
          <Button
            type="submit"
            form="product-form"
            variant="primary"
            className="flex-1"
            disabled={busy}
          >
            {uploading
              ? "Uploading images…"
              : saving
                ? "Saving…"
                : initial
                  ? "Update Product"
                  : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
        <Field label="Product images">
          <ProductImageUpload
            images={imageItems}
            onChange={setImageItems}
            disabled={busy}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
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
              className={inputClass}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Field>
          <Field label="Sale price (optional)">
            <input
              type="number"
              min={0}
              className={inputClass}
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select
              className={inputClass}
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
              className={inputClass}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            className={inputClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Field>

        <Field label="Care instructions (one per line)">
          <textarea
            className={`${inputClass} min-h-[60px]`}
            value={care}
            onChange={(e) => setCare(e.target.value)}
          />
        </Field>

        <div className="flex flex-wrap gap-6">
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

        <div className="border-t border-border-subtle pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Variants
            </span>
            <button
              type="button"
              className="text-xs text-gold-primary hover:underline"
              onClick={() => setVariants((v) => [...v, emptyVariant()])}
            >
              + Add variant
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center border border-border-subtle p-3 bg-background-raised/50"
              >
                <select
                  className={`${inputClass} text-xs`}
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
                  className={`${inputClass} text-xs`}
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                />
                <input
                  className={`${inputClass} text-xs`}
                  placeholder="#hex"
                  value={v.colorHex}
                  onChange={(e) => updateVariant(i, "colorHex", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  className={`${inputClass} text-xs`}
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  className="text-xs text-red-400 hover:underline justify-self-start sm:justify-self-center"
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
      <label className="block text-sm font-mono text-text-secondary mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
