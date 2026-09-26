import { NextResponse } from "next/server";
import { getAllProductsFromStore } from "@/lib/products-store";

export async function GET() {
  try {
    const products = await getAllProductsFromStore();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("[API Products] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
