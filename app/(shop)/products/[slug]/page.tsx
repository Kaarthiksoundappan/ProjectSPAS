import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ShoppingCart, Heart, Star, ChevronRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-brand-green-700">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-green-700">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl text-gray-300">🛒</div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 badge-green text-sm font-bold px-3 py-1">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm font-medium text-brand-green-600 hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            {avgRating && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900">${price.toFixed(2)}</span>
            {comparePrice && (
              <span className="text-xl text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
            )}
            <span className="text-sm text-gray-400">/ {product.unit}</span>
          </div>

          {/* Stock */}
          {product.stock === 0 ? (
            <span className="badge-red w-fit text-sm px-3 py-1">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="badge-yellow w-fit text-sm px-3 py-1">
              Only {product.stock} left in stock
            </span>
          ) : (
            <span className="badge-green w-fit text-sm px-3 py-1">In stock</span>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              disabled={product.stock === 0}
              className="btn-primary flex-1 gap-2 py-3 text-base disabled:opacity-40"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="btn-secondary p-3" aria-label="Add to wishlist">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Loyalty hint */}
          <p className="text-sm text-brand-green-700 bg-brand-green-50 rounded-lg px-4 py-3">
            Earn <strong>{Math.floor(price * 10)} loyalty points</strong> with this purchase
          </p>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${n <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.user.name}</span>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
