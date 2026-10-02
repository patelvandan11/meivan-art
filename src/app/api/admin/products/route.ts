import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getAllProductsFromStore,
  addProductToStore,
  updateProductInStore,
  deleteProductFromStore,
} from "@/lib/products-store";
import { categories } from "@/lib/data/products";

export async function GET() {
  try {
    const products = await getAllProductsFromStore();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("[Admin API Products GET] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      comparePrice,
      categorySlug,
      images,
      stock,
      featured,
      bestSeller,
      tags,
      isDigital,
      storagePath,
      storage_path,
    } = body;

    if (!name || !description || price === undefined || !categorySlug) {
      return NextResponse.json({ success: false, error: "Missing required product fields (name, description, price, category)" }, { status: 400 });
    }

    const matchedCat = categories.find((c) => c.slug === categorySlug);
    const categoryName = matchedCat ? matchedCat.name : categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    
    // Generate clean slug from product name
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const finalStoragePath = storagePath || storage_path || undefined;

    const newProduct = await addProductToStore({
      name,
      slug,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      category: categoryName,
      categorySlug,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"],
      stock: Number(stock) || 10,
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      tags: Array.isArray(tags) ? tags : [categorySlug],
      isDigital: Boolean(isDigital || finalStoragePath),
      storagePath: finalStoragePath,
      storage_path: finalStoragePath,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("[Admin API Products POST] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required for editing" }, { status: 400 });
    }

    if (updateData.storagePath || updateData.storage_path) {
      const path = updateData.storagePath || updateData.storage_path;
      updateData.storagePath = path;
      updateData.storage_path = path;
      if (updateData.isDigital === undefined) {
        updateData.isDigital = true;
      }
    }

    const updated = await updateProductInStore(id, updateData);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("[Admin API Products PUT] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required for deletion" }, { status: 400 });
    }

    const deleted = await deleteProductFromStore(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("[Admin API Products DELETE] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
