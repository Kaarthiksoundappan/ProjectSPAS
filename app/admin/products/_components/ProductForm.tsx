"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    categoryId: string;
    stock: number;
    unit: string;
    isActive: boolean;
    isFeatured: boolean;
    images: string[];
  };
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [comparePrice, setComparePrice] = useState(initialData?.comparePrice?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "0");
  const [unit, setUnit] = useState(initialData?.unit ?? "each");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) setSlug(toSlug(val));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setImages((prev) => [...prev, data.url]);
      else setError("Image upload failed");
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name, slug, description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      categoryId, stock: parseInt(stock), unit,
      isActive, isFeatured, images,
    };

    const url = isEdit ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — main details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Product Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                className="input"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Fresh Tomatoes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                className="input font-mono text-sm"
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="e.g. fresh-tomatoes"
                required
              />
              <p className="mt-1 text-xs text-gray-400">URL: /products/{slug || "..."}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input min-h-[100px] resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product..."
              />
            </div>
          </div>

          {/* Images */}
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-900">Images</h2>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 group">
                  <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
              <label className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-green-400 hover:text-brand-green-600 transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                <span className="mt-1 text-xs">{uploading ? "Uploading..." : "Add image"}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Right column — pricing & settings */}
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number" min="0" step="0.01"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (₹)</label>
              <input
                type="number" min="0" step="0.01"
                className="input"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="Original price (optional)"
              />
              <p className="mt-1 text-xs text-gray-400">Shows as strikethrough to highlight discount</p>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number" min="0"
                className="input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                className="input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, litre, each, 500g"
              />
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-900">Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-green-600"
              />
              <span className="text-sm text-gray-700">Active (visible in store)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-green-600"
              />
              <span className="text-sm text-gray-700">Featured (shown on homepage)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
