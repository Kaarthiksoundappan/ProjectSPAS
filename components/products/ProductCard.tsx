"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  return (
    <div className="card group relative flex flex-col overflow-hidden transition hover:shadow-md">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount && (
          <span className="badge-green text-xs font-semibold">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <span className="badge-red text-xs">Out of stock</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge-yellow text-xs">Only {product.stock} left</span>
        )}
      </div>

      {/* Wishlist */}
      <button
        className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow-sm opacity-0 transition group-hover:opacity-100 hover:text-red-500"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-gray-300">
            🛒
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-brand-green-700"
        >
          {product.name}
        </Link>

        <span className="text-xs text-gray-400">{product.category.name}</span>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-400">/ {product.unit}</span>
          </div>

          <button
            disabled={product.stock === 0}
            className="btn-primary p-2 disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
