"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { validateProductImage } from "@/lib/storage";
import { Upload, X, ImageIcon } from "lucide-react";

export type ProductImageItem = {
  /** Preview or saved URL */
  previewUrl: string;
  /** Set when user picks a new file (uploaded on save) */
  file?: File;
  /** Already stored in Supabase / DB */
  isExisting?: boolean;
};

interface ProductImageUploadProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ProductImageUpload({
  images,
  onChange,
  maxImages = 6,
  disabled = false,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const list = Array.from(files);
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images.`);
        return;
      }
      const toAdd = list.slice(0, remaining);
      const newItems: ProductImageItem[] = [];

      for (const file of toAdd) {
        const validation = validateProductImage(file);
        if (validation) {
          setError(validation);
          continue;
        }
        newItems.push({
          previewUrl: URL.createObjectURL(file),
          file,
          isExisting: false,
        });
      }

      if (newItems.length > 0) {
        onChange([...images, ...newItems]);
      }
    },
    [images, maxImages, onChange],
  );

  const removeAt = (index: number) => {
    const item = images[index];
    if (item.file && item.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
    onChange(images.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file && img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup blob URLs on unmount
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div
              key={`${img.previewUrl}-${i}`}
              className="relative aspect-square border border-border-subtle bg-background-raised overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`Product ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              )}
              {img.file && (
                <span className="absolute bottom-0 left-0 right-0 bg-gold-primary/90 text-black text-[10px] font-mono text-center py-0.5">
                  NEW
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? "border-gold-primary bg-gold-primary/5"
              : "border-border-subtle hover:border-gold-muted"
          } ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Upload className="mx-auto mb-2 text-gold-primary" size={28} />
          <p className="text-sm text-text-primary font-medium">
            Click or drag images here
          </p>
          <p className="text-xs text-text-muted mt-1">
            JPG, PNG, WebP, GIF · max 5MB each · up to {maxImages} images
          </p>
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <ImageIcon size={14} />
          <span>At least one product image is required.</span>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
