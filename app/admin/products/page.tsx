import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, AlertTriangle, Package } from "lucide-react";

interface SearchParams {
  filter?: string;
  category?: string;
  page?: string;
}

async function getProducts(searchParams: SearchParams) {
  const where: Record<string, unknown> = {};

  if (searchParams.filter === "low-stock") {
    where.stock = { lte: 5 };
    where.isActive = true;
  }
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  return db.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/products"
          className={`rounded-full border px-3 py-1 text-sm transition ${
            !params.filter && !params.category
              ? "border-brand-green-500 bg-brand-green-50 text-brand-green-700 font-medium"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          All
        </a>
        <a
          href="/admin/products?filter=low-stock"
          className={`rounded-full border px-3 py-1 text-sm transition ${
            params.filter === "low-stock"
              ? "border-yellow-500 bg-yellow-50 text-yellow-700 font-medium"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          Low Stock
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/admin/products?category=${cat.slug}`}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              params.category === cat.slug
                ? "border-brand-green-500 bg-brand-green-50 text-brand-green-700 font-medium"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Package className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">No products found.</p>
          <Link href="/admin/products/new" className="mt-3 inline-block btn-primary text-sm">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₹{Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-sm ${
                      product.stock === 0 ? "text-red-600" :
                      product.stock <= 5 ? "text-yellow-600" :
                      "text-gray-600"
                    }`}>
                      {product.stock <= 5 && product.stock > 0 && (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      )}
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    {product.isFeatured && (
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-medium bg-brand-green-100 text-brand-green-700">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
