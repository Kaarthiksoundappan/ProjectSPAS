"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";

export function CartButton() {
  const totalItems = useCart((s) => s.totalItems());

  return (
    <Link
      href="/cart"
      className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-green-700"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green-600 text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
