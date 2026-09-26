import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { products as initialProducts } from "@/lib/data/products";
import type { Product } from "@/types";

// In-memory store for products (persisted dynamically in memory and MongoDB)
let dynamicProducts: Product[] = [...initialProducts];

export async function getAllProductsFromStore(): Promise<Product[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const dbProducts = (await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1 })
        .toArray()) as unknown as Product[];

      if (dbProducts && dbProducts.length > 0) {
        const dbIds = new Set(dbProducts.map((p) => p.id));
        const merged = [...dbProducts];
        for (const initP of initialProducts) {
          if (!dbIds.has(initP.id)) {
            merged.push(initP);
          }
        }
        dynamicProducts = merged;
        return merged;
      }
    } catch (err) {
      console.error("[Products DB] Error reading from MongoDB:", err);
    }
  }

  return dynamicProducts;
}

export function getMemoryProducts(): Product[] {
  return dynamicProducts;
}

export async function addProductToStore(productData: Omit<Product, "id" | "rating" | "reviewCount"> & { id?: string }): Promise<Product> {
  const id = productData.id || `prod_${Date.now()}`;
  const newProduct: Product = {
    ...productData,
    id,
    rating: 5.0,
    reviewCount: 0,
    stock: productData.stock ?? 10,
    featured: productData.featured ?? false,
    bestSeller: productData.bestSeller ?? false,
    trending: productData.trending ?? false,
    tags: productData.tags || [productData.categorySlug],
  };

  // 1. Unshift into memory
  const existingIdx = dynamicProducts.findIndex((p) => p.id === id || p.slug === newProduct.slug);
  if (existingIdx >= 0) {
    dynamicProducts[existingIdx] = newProduct;
  } else {
    dynamicProducts.unshift(newProduct);
  }

  // Also push to initialProducts array if not present, for sync with data helpers
  const initIdx = initialProducts.findIndex((p) => p.id === id || p.slug === newProduct.slug);
  if (initIdx >= 0) {
    initialProducts[initIdx] = newProduct;
  } else {
    initialProducts.unshift(newProduct);
  }

  // 2. Persist in MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("products").updateOne(
        { id: newProduct.id },
        { $set: newProduct },
        { upsert: true }
      );
    } catch (err) {
      console.error("[Products DB] Failed to insert product to MongoDB:", err);
    }
  }

  return newProduct;
}

export async function updateProductInStore(id: string, updateData: Partial<Product>): Promise<Product | null> {
  const idx = dynamicProducts.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct = {
    ...dynamicProducts[idx],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  dynamicProducts[idx] = updatedProduct;

  const initIdx = initialProducts.findIndex((p) => p.id === id);
  if (initIdx >= 0) {
    initialProducts[initIdx] = updatedProduct;
  }

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("products").updateOne({ id }, { $set: updatedProduct });
    } catch (err) {
      console.error("[Products DB] Failed to update product in MongoDB:", err);
    }
  }

  return updatedProduct;
}

export async function deleteProductFromStore(id: string): Promise<boolean> {
  const idx = dynamicProducts.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  dynamicProducts.splice(idx, 1);

  const initIdx = initialProducts.findIndex((p) => p.id === id);
  if (initIdx >= 0) {
    initialProducts.splice(initIdx, 1);
  }

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("products").deleteOne({ id });
    } catch (err) {
      console.error("[Products DB] Failed to delete product from MongoDB:", err);
    }
  }

  return true;
}
