require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkProducts() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "artisan_haven";

  if (!uri) {
    console.log("MongoDB URI not set.");
    return;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const products = await db.collection("products").find({}).toArray();
    console.log(`Found ${products.length} products in MongoDB:`);
    products.forEach(p => {
      console.log(` - ID: ${p.id}, Name: ${p.name}, Category: ${p.category} (${p.categorySlug}), isDigital: ${p.isDigital}, StoragePath: ${p.storagePath || p.storage_path}`);
    });
    await client.close();
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
}

checkProducts();
