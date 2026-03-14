import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const receiptId = `rcpt_${session.user.id.slice(-8)}_${Date.now()}`;
    const order = await createRazorpayOrder(amount, receiptId);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[RAZORPAY_CREATE_ORDER]", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
