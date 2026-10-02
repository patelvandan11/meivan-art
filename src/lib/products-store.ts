import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { products as initialProducts } from "@/lib/data/products";
import type { Product } from "@/types";

// In-memory store for products (persisted dynamically in memory and MongoDB)
let dynamicProducts: Product[] = [...initialProducts];
const deletedProductIds = new Set<string>();

export async function getAllProductsFromStore(): Promise<Product[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const dbProducts = (await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1 })
        .toArray()) as unknown as Product[];

      if (dbProducts) {
        dynamicProducts = dbProducts.filter(
          (p) => !deletedProductIds.has(p.id) && !deletedProductIds.has(p.slug)
        );
        return dynamicProducts;
      }
    } catch (err) {
      console.error("[Products DB] Error reading from MongoDB:", err);
    }
  }

  dynamicProducts = dynamicProducts.filter(
    (p) => !deletedProductIds.has(p.id) && !deletedProductIds.has(p.slug)
  );
  return dynamicProducts;
}

export function getMemoryProducts(): Product[] {
  return dynamicProducts.filter(
    (p) => !deletedProductIds.has(p.id) && !deletedProductIds.has(p.slug)
  );
}

export async function getProductBySlugFromStore(slug: string): Promise<Product | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();
  
  if (deletedProductIds.has(normalizedSlug) || deletedProductIds.has(slug)) {
    return undefined;
  }

  // 1. Search memory
  const memoryMatch = dynamicProducts.find(
    (p) =>
      !deletedProductIds.has(p.id) &&
      !deletedProductIds.has(p.slug) &&
      (p.slug.toLowerCase() === normalizedSlug || p.id.toLowerCase() === normalizedSlug)
  );
  if (memoryMatch) return memoryMatch;

  // 2. Query MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const doc = (await db.collection("products").findOne({
        $or: [
          { slug: normalizedSlug },
          { id: normalizedSlug },
          { slug: slug },
          { id: slug },
        ],
      })) as unknown as Product | null;

      if (doc && !deletedProductIds.has(doc.id) && !deletedProductIds.has(doc.slug)) {
        if (!dynamicProducts.some((p) => p.id === doc.id)) {
          dynamicProducts.unshift(doc);
        }
        return doc;
      }
    } catch (err) {
      console.error("[Products DB] Error querying product by slug from MongoDB:", err);
    }
  }

  return undefined;
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
    isDigital: productData.isDigital ?? false,
    storagePath: productData.storagePath || productData.storage_path || undefined,
    storage_path: productData.storage_path || productData.storagePath || undefined,
  };

  deletedProductIds.delete(id);
  deletedProductIds.delete(newProduct.slug);

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
  const idx = dynamicProducts.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return null;

  const updatedProduct = {
    ...dynamicProducts[idx],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  dynamicProducts[idx] = updatedProduct;

  const initIdx = initialProducts.findIndex((p) => p.id === id || p.slug === id);
  if (initIdx >= 0) {
    initialProducts[initIdx] = updatedProduct;
  }

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("products").updateOne(
        { $or: [{ id }, { slug: id }] },
        { $set: updatedProduct }
      );
    } catch (err) {
      console.error("[Products DB] Failed to update product in MongoDB:", err);
    }
  }

  return updatedProduct;
}

export async function deleteProductFromStore(idOrSlug: string): Promise<boolean> {
  const target = idOrSlug.trim();
  const targetLower = target.toLowerCase();

  // Mark as deleted in global exclusion set
  deletedProductIds.add(target);
  deletedProductIds.add(targetLower);

  // Find product to remove by ID or slug
  const matchedProduct = dynamicProducts.find(
    (p) => p.id.toLowerCase() === targetLower || p.slug.toLowerCase() === targetLower
  );

  if (matchedProduct) {
    deletedProductIds.add(matchedProduct.id);
    deletedProductIds.add(matchedProduct.slug);
  }

  // Remove from dynamicProducts
  dynamicProducts = dynamicProducts.filter(
    (p) => p.id.toLowerCase() !== targetLower && p.slug.toLowerCase() !== targetLower
  );

  // Remove from initialProducts
  for (let i = initialProducts.length - 1; i >= 0; i--) {
    if (
      initialProducts[i].id.toLowerCase() === targetLower ||
      initialProducts[i].slug.toLowerCase() === targetLower
    ) {
      initialProducts.splice(i, 1);
    }
  }

  // Completely delete from MongoDB database
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("products").deleteMany({
        $or: [
          { id: target },
          { slug: target },
          { id: targetLower },
          { slug: targetLower },
        ],
      });
    } catch (err) {
      console.error("[Products DB] Failed to delete product from MongoDB:", err);
    }
  }

  return true;
}
