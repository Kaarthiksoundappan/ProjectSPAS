"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/store/cart";

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  stock: number;
}

export function AddToCartButton({ productId, name, price, image, unit, stock }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, name, price, image, unit, stock });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={stock === 0}
      className={`btn-primary flex-1 gap-2 py-3 text-base transition disabled:opacity-40 disabled:cursor-not-allowed ${
        added ? "bg-brand-green-500" : ""
      }`}
    >
      {added ? (
        <><Check className="h-5 w-5" /> Added to Cart</>
      ) : (
        <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
      )}
    </button>
  );
}
