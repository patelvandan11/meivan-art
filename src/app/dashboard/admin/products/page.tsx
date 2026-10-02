"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Search, Trash2, Edit2, CheckCircle2, AlertCircle, Sparkles, Layers, ArrowUp, ArrowDown, Image as ImageIcon, FileText, Upload } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ImageUpload";
import { categories } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [categorySlug, setCategorySlug] = useState("paintings");
  const [images, setImages] = useState<string[]>([""]);
  const [stock, setStock] = useState("20");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [tags, setTags] = useState("");
  const [isDigital, setIsDigital] = useState(false);
  const [storagePath, setStoragePath] = useState("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [supabaseFiles, setSupabaseFiles] = useState<{ name: string; path: string }[]>([]);

  const fetchSupabaseFiles = async () => {
    try {
      const res = await fetch("/api/admin/digital/files");
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setSupabaseFiles(data.files);
      }
    } catch (err) {
      console.error("Error fetching Supabase files:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setComparePrice("");
    setCategorySlug("digital");
    setImages([""]);
    setStock("999");
    setFeatured(false);
    setBestSeller(false);
    setTags("digital, pdf");
    setIsDigital(true);
    setStoragePath("animal-coloring-book-by-meivan-art.pdf.pdf");
    setFeedback(null);
    fetchSupabaseFiles();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setComparePrice(product.comparePrice ? String(product.comparePrice) : "");
    setCategorySlug(product.categorySlug || "paintings");
    setImages(product.images && product.images.length > 0 ? [...product.images] : [""]);
    setStock(String(product.stock || 10));
    setFeatured(Boolean(product.featured));
    setBestSeller(Boolean(product.bestSeller));
    setTags(product.tags ? product.tags.join(", ") : "");
    setIsDigital(Boolean(product.isDigital || product.storagePath || product.storage_path));
    setStoragePath(product.storagePath || product.storage_path || "");
    setFeedback(null);
    fetchSupabaseFiles();
    setIsModalOpen(true);
  };

  const handlePdfUpload = async (file: File) => {
    setPdfUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (storagePath) {
        formData.append("storagePath", storagePath);
      }

      const res = await fetch("/api/admin/digital/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload PDF file");
      }

      setStoragePath(data.storagePath);
      setIsDigital(true);
      setFeedback({
        type: "success",
        message: `PDF uploaded successfully to Supabase! Storage Path: ${data.storagePath}`,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: "error", message: error.message || "PDF upload failed" });
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setFeedback(null);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
    const finalImages =
      cleanedImages.length > 0
        ? cleanedImages
        : ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"];

    const payload = {
      name,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      categorySlug,
      images: finalImages,
      stock: Number(stock) || 10,
      featured,
      bestSeller,
      tags: tagArray,
      isDigital: isDigital || Boolean(storagePath),
      storagePath: storagePath.trim() || undefined,
      storage_path: storagePath.trim() || undefined,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      setFeedback({
        type: "success",
        message: editingProduct ? "Product updated successfully!" : "New product added successfully!",
      });
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: "error", message: error.message || "Failed to save product" });
    } finally {
      setStatus("idle");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setStatus("deleting");
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      setFeedback({ type: "success", message: `Deleted "${name}"` });
      fetchProducts();
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: "error", message: error.message || "Failed to delete product" });
    } finally {
      setStatus("idle");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold">Products Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add new items, update prices, manage inventory, and remove products.
            </p>
          </div>
          <Button onClick={openCreateModal} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-terracotta/30"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Table */}
        <div className="rounded-card border border-border bg-card shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading products catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No products found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground bg-secondary/30">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Badges</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image
                              src={product.images[0] || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</p>
                              {product.images && product.images.length > 1 && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-terracotta/10 px-1.5 py-0.5 text-[10px] font-semibold text-terracotta border border-terracotta/20 shrink-0">
                                  <Layers className="h-3 w-3" />
                                  {product.images.length} idea slides
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.category}</td>
                      <td className="p-4 font-semibold">
                        {formatPrice(product.price)}
                        {product.comparePrice && (
                          <span className="ml-1 text-xs text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.stock > 5
                              ? "bg-sage/20 text-sage"
                              : product.stock > 0
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.featured && (
                            <span className="rounded bg-terracotta/15 px-2 py-0.5 text-[10px] font-semibold text-terracotta">
                              Featured
                            </span>
                          )}
                          {product.bestSeller && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              Best Seller
                            </span>
                          )}
                          {(product.isDigital || product.storagePath || product.storage_path) && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center gap-1">
                              <FileText className="h-3 w-3" /> Digital PDF
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditModal(product)}
                            title="Edit Product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-card border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-terracotta" />
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Modern Canvas Artwork"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={categorySlug}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategorySlug(val);
                        if (val === "digital") {
                          setIsDigital(true);
                          if (!storagePath) {
                            setStoragePath("animal-coloring-book-by-meivan-art.pdf.pdf");
                          }
                        }
                      }}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-terracotta/30"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.slug === "digital" ? "⚡ Digital Downloads (PDF Storage)" : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="999"
                      required
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
                    <Input
                      type="number"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
                      placeholder="1299 (optional)"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <Input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="20"
                      required
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about materials, craftsmanship, dimensions, etc."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-terracotta/30"
                    required
                  />
                </div>

                {/* Multi-Image Upload & Idea Management */}
                <div className="space-y-3 rounded-xl border border-border bg-secondary/10 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <label className="block text-sm font-semibold flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-terracotta" />
                        Product Images & Decor Ideas *
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add multiple images (e.g. main artwork + different frame styles or room decor ideas for slideshow).
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setImages((prev) => [...prev, ""])}
                      className="gap-1.5 text-xs shrink-0 self-start sm:self-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Idea Image
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {images.map((url, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border/80 bg-card p-3.5 shadow-xs space-y-3 relative transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-terracotta flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            {idx === 0
                              ? "Main Cover Photo"
                              : `Idea / Style View #${idx} (Slideshow)`}
                          </span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                title="Move up"
                                onClick={() => {
                                  const updated = [...images];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx - 1];
                                  updated[idx - 1] = temp;
                                  setImages(updated);
                                }}
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {idx < images.length - 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                title="Move down"
                                onClick={() => {
                                  const updated = [...images];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx + 1];
                                  updated[idx + 1] = temp;
                                  setImages(updated);
                                }}
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {images.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                title="Remove Image"
                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <ImageUpload
                          folder="products"
                          defaultValue={url}
                          onUpload={(result) => {
                            const updated = [...images];
                            updated[idx] = result.url;
                            setImages(updated);
                          }}
                          onRemove={() => {
                            const updated = [...images];
                            updated[idx] = "";
                            setImages(updated);
                          }}
                          label=""
                        />

                        <div className="space-y-1">
                          <p className="text-[11px] font-medium text-muted-foreground">Or direct image URL:</p>
                          <Input
                            value={url}
                            onChange={(e) => {
                              const updated = [...images];
                              updated[idx] = e.target.value;
                              setImages(updated);
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="handmade, ceramic, mug, gift"
                  />
                </div>

                {/* Supabase Digital PDF Settings */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-blue-900 dark:text-blue-300">
                      <input
                        type="checkbox"
                        checked={isDigital}
                        onChange={(e) => setIsDigital(e.target.checked)}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      <FileText className="h-4 w-4" />
                      Digital PDF Product (Supabase Storage)
                    </label>
                  </div>

                  {isDigital && (
                    <div className="space-y-3 border-t border-blue-200 dark:border-blue-900/50 pt-3">
                      {/* Dropdown to pick existing file from Supabase Storage */}
                      {supabaseFiles.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            Select Existing File from Supabase Bucket:
                          </label>
                          <select
                            value={storagePath}
                            onChange={(e) => setStoragePath(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Choose file from bucket --</option>
                            {supabaseFiles.map((file) => (
                              <option key={file.path} value={file.path}>
                                📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Supabase Storage Path (e.g. <code className="font-mono font-bold text-foreground">animal-coloring-book-by-meivan-art.pdf.pdf</code>)
                        </label>
                        <Input
                          value={storagePath}
                          onChange={(e) => setStoragePath(e.target.value)}
                          placeholder="animal-coloring-book-by-meivan-art.pdf.pdf"
                          className="bg-background text-sm font-mono"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
                        <div className="text-xs">
                          <p className="font-medium text-foreground">Upload PDF File to Supabase</p>
                          <p className="text-muted-foreground text-[11px]">Directly uploads to <code className="font-mono">digital-pdfs</code> bucket</p>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePdfUpload(file);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={pdfUploading}
                            className="gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-none"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input) input.click();
                            }}
                          >
                            <Upload className="h-3.5 w-3.5" />
                            {pdfUploading ? "Uploading to Supabase..." : "Select & Upload PDF"}
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-border text-terracotta focus:ring-terracotta"
                    />
                    Mark as Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={bestSeller}
                      onChange={(e) => setBestSeller(e.target.checked)}
                      className="rounded border-border text-terracotta focus:ring-terracotta"
                    />
                    Mark as Best Seller
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={status === "saving"}>
                    {status === "saving" ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
