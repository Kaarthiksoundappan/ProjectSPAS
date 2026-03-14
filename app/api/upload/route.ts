import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadProductImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admin roles can upload images
    if (
      !session ||
      (session.user.role !== "STORE_ADMIN" && session.user.role !== "INVENTORY_MANAGER")
    ) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const url = await uploadProductImage(base64);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
