import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "STORE_ADMIN") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name, slug, description, price, comparePrice,
      categoryId, stock, unit, isActive, isFeatured, images,
    } = body;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        comparePrice: comparePrice || null,
        categoryId,
        stock: stock ?? 0,
        unit: unit || "each",
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        images: images ?? [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PRODUCTS POST]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
