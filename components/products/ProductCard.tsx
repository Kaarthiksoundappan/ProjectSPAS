"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { parseImages } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string | string[];
  stock: number;
  unit: string;
  category: { name: string };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const images = parseImages(product.images);
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] ?? "",
      unit: product.unit,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

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
        {images[0] ? (
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-gray-300">🛒</div>
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
              ₹{Number(product.price).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{Number(product.comparePrice).toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-400">/ {product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg text-white transition ${
              added
                ? "bg-brand-green-500"
                : "bg-brand-green-600 hover:bg-brand-green-700"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Add to cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
