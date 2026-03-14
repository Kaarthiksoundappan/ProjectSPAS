import Link from "next/link";
import { Construction, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-50 border-2 border-yellow-200">
        <Construction className="h-12 w-12 text-yellow-500" />
      </div>

      {/* Message */}
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900">Payments Coming Soon</h1>
        <p className="mt-3 text-gray-500 leading-relaxed">
          We&apos;re setting up our payment system to support{" "}
          <strong>UPI, Google Pay, Cards, and Net Banking</strong> for Indian
          customers. This will be ready very soon.
        </p>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-sm font-medium text-yellow-700">Work in Progress</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Link href="/cart" className="btn-secondary gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <Link href="/products" className="btn-primary gap-2">
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
