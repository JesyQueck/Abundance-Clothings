"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionTitle, SubTitle, Badge } from "@/components/ui/PRDComponents";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/db";
import { Product, ProductVariant, Category } from "@/types";
import { formatPrice, getStockStatusColor } from "@/lib/utils";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const generateProductId = () =>
  "prod_" + Math.random().toString(36).slice(2, 9);

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be positive"),
  salePrice: z.number().min(0).optional().or(z.literal(0)),
  category: z.enum(["mens", "womens", "accessories"], {
    required_error: "Category is required",
  }),
  tags: z.array(z.string()),
  images: z.array(z.string()).min(1, "At least one image URL is required"),
  variants: z
    .array(
      z.object({
        size: z.enum(["XS", "S", "M", "L", "XL", "XXL"], {
          required_error: "Size is required",
        }),
        color: z.string().min(1, "Color is required"),
        colorHex: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
        stock: z.number().min(0, "Stock cannot be negative"),
      }),
    )
    .min(1, "At least one variant is required"),
  material: z.string().min(1, "Material is required"),
  care: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ),
  featured: z.boolean(),
  published: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const AdminProductsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0.01,
      salePrice: 0,
      category: "mens",
      tags: [],
      images: [],
      variants: [{ size: "M", color: "Black", colorHex: "#000000", stock: 10 }],
      material: "",
      care: [],
      featured: false,
      published: true,
    },
  });

  const watchedVariants = watch("variants");

  useEffect(() => {
    const auth = localStorage.getItem("abundance_admin_auth");
    if (auth !== "true") {
      router.push("/admin-login");
    } else {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    setProducts(await getAllProducts()); // Use getAllProducts to get all products, including unpublished
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      ...product,
      tags: product.tags.join(", "),
      images: product.images.join(", "),
      care: product.care.join(", "),
      salePrice: product.salePrice || 0, // Ensure salePrice is a number for the form
    });
    setIsAddingNew(false);
    setModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    reset({
      name: "",
      slug: "",
      description: "",
      price: 0.01,
      salePrice: 0,
      category: "mens",
      tags: "",
      images: "",
      variants: [{ size: "M", color: "Black", colorHex: "#000000", stock: 10 }],
      material: "",
      care: "",
      featured: false,
      published: true,
    });
    setIsAddingNew(true);
    setModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
      fetchProducts();
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const productToSave: Product = {
      ...data,
      id: editingProduct?.id || generateProductId(),
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      salePrice: (data.salePrice as number) === 0 ? undefined : (data.salePrice as number),
    };

    if (isAddingNew) {
      await addProduct(productToSave);
    } else if (editingProduct) {
      await updateProduct(productToSave);
    }
    setModalOpen(false);
    fetchProducts();
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  const addVariant = () => {
    const currentVariants = getValues("variants") || [];
    reset({
      ...getValues(),
      variants: [
        ...currentVariants,
        { size: "M", color: "Black", colorHex: "#000000", stock: 10 },
      ],
    });
  };

  const removeVariant = (index: number) => {
    const currentVariants = getValues("variants") || [];
    reset({
      ...getValues(),
      variants: currentVariants.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Product Management</SectionTitle>
      <p className="mb-8 text-lg leading-relaxed">
        Manage your store's products, inventory, and details.
      </p>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddProduct} variant="primary">
          <Plus size={18} className="mr-2" /> Add New Product
        </Button>
      </div>

      <Card>
        <table className="min-w-full divide-y divide-border-subtle">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-16 h-16 relative">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-secondary capitalize">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gold-primary font-mono">
                  ₦{formatPrice(product.price)}
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="ml-2 text-red-500 line-through">
                      ₦{formatPrice(product.salePrice)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-mono uppercase ${getStockStatusColor(String(product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)))}`}
                  >
                    {product.variants.reduce((sum, v) => sum + v.stock, 0) > 0
                      ? "In Stock"
                      : "Out of Stock"}
                    {product.variants.some(
                      (v) => v.stock > 0 && v.stock <= 5,
                    ) && <span className="ml-1 text-yellow-500">(Low)</span>}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge type={product.published ? "green" : "default"}>
                    {product.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="text-gold-primary hover:text-white mr-2"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </Button>
            <h2 className="text-2xl font-bebas-neue text-gold-primary mb-6 border-b border-border-subtle pb-2">
              {isAddingNew
                ? "Add New Product"
                : `Edit Product: ${editingProduct?.name}`}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Product Name"
                id="name"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Product Slug"
                id="slug"
                {...register("slug")}
                error={errors.slug?.message}
              />
              <Input
                label="Description"
                type="textarea"
                id="description"
                {...register("description")}
                error={errors.description?.message}
              />
              <Input
                label="Price (₦)"
                type="number"
                id="price"
                {...register("price", { valueAsNumber: true })}
                error={errors.price?.message}
                step="0.01"
              />
              <Input
                label="Sale Price (₦) (Optional)"
                type="number"
                id="salePrice"
                {...register("salePrice", { valueAsNumber: true })}
                error={errors.salePrice?.message}
                step="0.01"
              />

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-mono text-text-secondary mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full p-2 bg-background-raised border border-border-subtle text-text-primary focus:outline-none focus:border-gold-primary"
                >
                  <option value="mens">Men's</option>
                  <option value="womens">Women's</option>
                  <option value="accessories">Accessories</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-mono text-text-secondary mb-1">
                  Tags (comma-separated)
                </label>
                <textarea
                  id="tags"
                  {...register("tags")}
                  className="w-full p-2 bg-background-raised border border-border-subtle text-text-primary focus:outline-none focus:border-gold-primary"
                  rows={2}
                />
                {errors.tags && (
                  <p className="mt-1 text-xs text-red-500">{errors.tags.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-mono text-text-secondary mb-1">
                  Image URLs (comma-separated)
                </label>
                <textarea
                  id="images"
                  {...register("images")}
                  className="w-full p-2 bg-background-raised border border-border-subtle text-text-primary focus:outline-none focus:border-gold-primary"
                  rows={2}
                />
                {errors.images && (
                  <p className="mt-1 text-xs text-red-500">{errors.images.message}</p>
                )}
              </div>

              <div>
                <SubTitle>Variants</SubTitle>
                {watchedVariants.map((variant: any, index: number) => (
                  <Card
                    key={index}
                    className="mb-4 p-4 border border-border-subtle"
                  >
                    <div className="flex justify-end mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-500"
                      >
                        <X size={16} /> Remove Variant
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`variants.${index}.size`}
                          className="block text-sm font-mono text-text-secondary mb-1"
                        >
                          Size
                        </label>
                        <select
                          id={`variants.${index}.size`}
                          {...register(`variants.${index}.size`)}
                          className="w-full p-2 bg-background-raised border border-border-subtle text-text-primary focus:outline-none focus:border-gold-primary"
                        >
                          {["XS", "S", "M", "L", "XL", "XXL"].map(
                            (sizeOption) => (
                              <option key={sizeOption} value={sizeOption}>
                                {sizeOption}
                              </option>
                            ),
                          )}
                        </select>
                        {errors.variants && (errors.variants as any)[index]?.size && (
                          <p className="mt-1 text-xs text-red-500">
                            {(errors.variants as any)[index]?.size?.message}
                          </p>
                        )}
                      </div>
                      <Input
                        label="Color"
                        id={`variants.${index}.color`}
                        {...register(`variants.${index}.color`)}
                        error={errors.variants && (errors.variants as any)[index]?.color?.message}
                      />
                      <Input
                        label="Color Hex"
                        id={`variants.${index}.colorHex`}
                        {...register(`variants.${index}.colorHex`)}
                        error={errors.variants && (errors.variants as any)[index]?.colorHex?.message}
                      />
                      <Input
                        label="Stock"
                        type="number"
                        id={`variants.${index}.stock`}
                        {...register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                        error={errors.variants && (errors.variants as any)[index]?.stock?.message}
                      />
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  onClick={addVariant}
                  variant="secondary"
                  className="mt-4"
                >
                  <Plus size={16} className="mr-2" /> Add Variant
                </Button>
                {errors.variants && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.variants.message}
                  </p>
                )}
              </div>

              <Input
                label="Material"
                id="material"
                {...register("material")}
                error={errors.material?.message}
              />
              <Input
                label="Care Instructions (comma-separated)"
                id="care"
                {...register("care")}
                error={errors.care?.message}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="form-checkbox h-4 w-4 text-gold-primary bg-background-raised border-border-subtle focus:ring-gold-primary"
                />
                <label htmlFor="featured" className="text-text-secondary">
                  Featured Product
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register("published")}
                  className="form-checkbox h-4 w-4 text-gold-primary bg-background-raised border-border-subtle focus:ring-gold-primary"
                />
                <label htmlFor="published" className="text-text-secondary">
                  Published
                </label>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-6">
                <Save size={18} className="mr-2" />{" "}
                {isAddingNew ? "Create Product" : "Save Changes"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
