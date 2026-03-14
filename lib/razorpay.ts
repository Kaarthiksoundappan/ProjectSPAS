import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ─── Loyalty helpers ──────────────────────────────────────────────────────────

export const POINTS_PER_RUPEE = 1;          // 1 point per ₹1 spent
export const POINTS_REDEMPTION_RATE = 0.25; // 1 point = ₹0.25

export function calculateLoyaltyPointsEarned(orderTotal: number): number {
  return Math.floor(orderTotal * POINTS_PER_RUPEE);
}

export function calculatePointsDiscount(points: number): number {
  return points * POINTS_REDEMPTION_RATE;
}

// ─── Razorpay order ───────────────────────────────────────────────────────────

export async function createRazorpayOrder(amountInRupees: number, receiptId: string) {
  return razorpay.orders.create({
    amount: Math.round(amountInRupees * 100), // paise
    currency: "INR",
    receipt: receiptId,
  });
}

// ─── Signature verification ───────────────────────────────────────────────────

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expectedSignature === razorpaySignature;
}
