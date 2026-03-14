"use client";

import { useState } from "react";
import { CreditCard, Banknote, Smartphone, CheckCircle2, Loader2 } from "lucide-react";

type PaymentMethod = "CARD" | "GOOGLE_PAY" | "CASH";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: "GOOGLE_PAY",
    label: "Google Pay",
    icon: <Smartphone className="h-5 w-5" />,
    desc: "Pay instantly with Google Pay",
  },
  {
    id: "CARD",
    label: "Credit / Debit Card",
    icon: <CreditCard className="h-5 w-5" />,
    desc: "Visa, Mastercard, Amex",
  },
  {
    id: "CASH",
    label: "Cash on Pickup",
    icon: <Banknote className="h-5 w-5" />,
    desc: "Pay in store when you collect your order",
  },
];

export default function CheckoutPage() {
  const [payment, setPayment] = useState<PaymentMethod>("GOOGLE_PAY");
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Demo values — will be wired to cart state
  const subtotal = 0;
  const pointsBalance = 0;
  const pointsDiscount = redeemPoints ? Math.min(pointsBalance * 0.01, subtotal * 0.2) : 0;
  const total = Math.max(0, subtotal - pointsDiscount);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: call /api/orders POST
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setPlaced(true);
  }

  if (placed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <CheckCircle2 className="h-20 w-20 text-brand-green-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="mt-2 text-gray-500">
            Thank you for shopping at SPAS Super Store. You&apos;ll receive a confirmation shortly.
          </p>
        </div>
        <a href="/account/orders" className="btn-primary">
          View My Orders
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left: Payment */}
        <div className="lg:col-span-3 space-y-6">
          {/* Payment method */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
                    payment === opt.id
                      ? "border-brand-green-500 bg-brand-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="sr-only"
                  />
                  <span className={payment === opt.id ? "text-brand-green-600" : "text-gray-400"}>
                    {opt.icon}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                  {payment === opt.id && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-brand-green-500" />
                  )}
                </label>
              ))}
            </div>

            {/* Card fields */}
            {payment === "CARD" && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Card number</label>
                  <input type="text" className="input" placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Expiry</label>
                    <input type="text" className="input" placeholder="MM / YY" maxLength={7} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">CVV</label>
                    <input type="text" className="input" placeholder="•••" maxLength={4} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loyalty points */}
          {pointsBalance > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Loyalty Points</p>
                  <p className="text-sm text-gray-500">
                    You have <strong>{pointsBalance} points</strong> (worth ${(pointsBalance * 0.01).toFixed(2)})
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-brand-green-500 transition" />
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-sm text-brand-green-600">
                <span>Points discount</span>
                <span>-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading || subtotal === 0}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order...</>
              ) : (
                "Place Order"
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By placing your order you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
