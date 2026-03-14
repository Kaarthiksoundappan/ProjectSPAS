import { Suspense } from "react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchParams {
  category?: string;
  q?: string;
  featured?: string;
  deals?: string;
  page?: string;
}

async function getProducts(searchParams: SearchParams) {
  const where: Record<string, unknown> = { isActive: true };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }
  if (searchParams.featured === "true") {
    where.isFeatured = true;
  }
  if (searchParams.q) {
    where.name = { contains: searchParams.q, mode: "insensitive" };
  }

  return db.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 48,
  });
}

async function getCategories() {
  return db.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="card p-5 space-y-5">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/products"
                    className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-brand-green-50 hover:text-brand-green-700 ${
                      !params.category ? "bg-brand-green-50 font-medium text-brand-green-700" : "text-gray-600"
                    }`}
                  >
                    All Products
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/products?category=${cat.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-brand-green-50 hover:text-brand-green-700 ${
                        params.category === cat.slug
                          ? "bg-brand-green-50 font-medium text-brand-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="mb-6 flex items-center gap-3">
            <form className="relative flex-1" method="get" action="/products">
              {params.category && (
                <input type="hidden" name="category" value={params.category} />
              )}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                name="q"
                defaultValue={params.q}
                placeholder="Search products..."
                className="input pl-9"
              />
            </form>
          </div>

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {params.category
                ? categories.find((c) => c.slug === params.category)?.name ?? "Products"
                : "All Products"}
            </h1>
            <span className="text-sm text-gray-500">{products.length} products</span>
          </div>

          {/* Grid */}
          <Suspense fallback={<ProductsGridSkeleton />}>
            {products.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
                <p className="text-gray-400">No products found.</p>
                <a href="/products" className="mt-2 inline-block text-sm text-brand-green-600 hover:underline">
                  Clear filters
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
                    }}
                  />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card aspect-[3/4] animate-pulse bg-gray-100" />
      ))}
    </div>
  );
}
