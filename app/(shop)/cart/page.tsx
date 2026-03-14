"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { CartItem } from "@/types";

// Placeholder cart — will be replaced with Zustand store in a later iteration
const DEMO_ITEMS: CartItem[] = [];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(DEMO_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  function increment(productId: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.quantity < i.stock
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }

  function decrement(productId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function remove(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function applyCoupon() {
    if (coupon.trim()) setCouponApplied(true);
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-200" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-1 text-gray-500">Add some products to get started.</p>
        </div>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">🛒</div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <button
                    onClick={() => remove(item.productId)}
                    className="ml-4 text-gray-400 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} / {item.unit}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => decrement(item.productId)}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.productId)}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <Tag className="h-4 w-4" /> Promo Code
            </h2>
            {couponApplied ? (
              <div className="flex items-center justify-between rounded-lg bg-brand-green-50 px-3 py-2">
                <span className="text-sm font-medium text-brand-green-700">{coupon} — 10% off</span>
                <button
                  onClick={() => { setCouponApplied(false); setCoupon(""); }}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="input flex-1"
                />
                <button onClick={applyCoupon} className="btn-secondary px-3">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-brand-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center mt-2">
              Proceed to Checkout
            </Link>

            <Link href="/products" className="btn-secondary w-full text-center text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
