import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import type { DbUser } from "@/lib/auth";
import type { UserRole } from "@/types";

export async function ensureSeedUsers() {
  if (!isMongoConfigured()) return;

  const db = await getDb();
  const users = db.collection<Omit<DbUser, "_id"> & { _id?: ObjectId }>("users");

  const adminEmail = "vandan11patel@gmail.com";
  const existingAdmin = await users.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    await users.insertOne({
      email: adminEmail,
      name: "Vandan Patel",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  }

  const seedAccounts = [
    {
      email: "artist@artisanhaven.com",
      name: "Maya Chen",
      role: "artist" as UserRole,
      artistSlug: "maya-chen",
      password: "Artist@123",
    },
    {
      email: "user@artisanhaven.com",
      name: "Priya Sharma",
      role: "user" as UserRole,
      password: "User@123",
    },
  ];

  for (const account of seedAccounts) {
    const exists = await users.findOne({ email: account.email });
    if (!exists) {
      await users.insertOne({
        email: account.email,
        name: account.name,
        passwordHash: await bcrypt.hash(account.password, 12),
        role: account.role,
        artistSlug: account.artistSlug,
        createdAt: new Date(),
      });
    }
  }
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.collection<DbUser>("users").findOne({
    email: email.toLowerCase().trim(),
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}) {
  const db = await getDb();
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const doc = {
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    passwordHash: await bcrypt.hash(data.password, 12),
    role: data.role || ("user" as UserRole),
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(doc);
  return { ...doc, _id: result.insertedId } as DbUser;
}

export async function saveMagicToken(email: string, token: string) {
  const db = await getDb();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.collection("magic_tokens").deleteMany({ email });
  await db.collection("magic_tokens").insertOne({ email, token, expiresAt });

  return expiresAt;
}

export async function consumeMagicToken(token: string) {
  const db = await getDb();
  const record = await db.collection<{ email: string; token: string; expiresAt: Date }>(
    "magic_tokens"
  ).findOne({ token });

  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  await db.collection("magic_tokens").deleteOne({ token });
  return findUserByEmail(record.email);
}
