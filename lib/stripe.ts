import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const POINTS_PER_DOLLAR = 10;
export const POINTS_REDEMPTION_RATE = 0.01; // 1 point = $0.01

export function calculateLoyaltyPointsEarned(orderTotal: number): number {
  return Math.floor(orderTotal * POINTS_PER_DOLLAR);
}

export function calculatePointsDiscount(points: number): number {
  return points * POINTS_REDEMPTION_RATE;
}
