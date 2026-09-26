import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import type { DbUser } from "@/lib/auth";
import type { UserRole } from "@/types";

export async function ensureSeedUsers() {
  if (!isMongoConfigured()) return;

  const db = await getDb();
  const users = db.collection<Omit<DbUser, "_id"> & { _id?: ObjectId }>("users");

  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || "vandan11patel@gmail.com";
  const adminName = process.env.ADMIN_NAME || "Admin";
  const existingAdmin = await users.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    await users.insertOne({
      email: adminEmail,
      name: adminName,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`Seeded admin user: ${adminEmail}`);
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
  const record = await db.collection<{ email: string; token: string; expiresAt: Date | string }>(
    "magic_tokens"
  ).findOne({ token });

  if (!record || new Date(record.expiresAt) < new Date()) {
    return null;
  }

  await db.collection("magic_tokens").deleteOne({ token });
  return findUserByEmail(record.email);
}

// In-memory OTP storage fallback
const inMemoryOtps = new Map<string, { otp: string; expiresAt: number }>();

export async function savePasswordResetOtp(email: string, otp: string): Promise<Date> {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  // Store in memory fallback
  inMemoryOtps.set(normalizedEmail, { otp, expiresAt: expiresAt.getTime() });

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("password_otps").deleteMany({ email: normalizedEmail });
      await db.collection("password_otps").insertOne({
        email: normalizedEmail,
        otp,
        expiresAt,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("[Users DB] Failed to save OTP in MongoDB:", err);
    }
  }

  return expiresAt;
}

export async function verifyPasswordResetOtp(email: string, otp: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedOtp = otp.trim();

  // Check MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const record = await db.collection<{ email: string; otp: string; expiresAt: Date | string }>(
        "password_otps"
      ).findOne({ email: normalizedEmail, otp: trimmedOtp });

      if (record && new Date(record.expiresAt) >= new Date()) {
        return true;
      }
    } catch (err) {
      console.error("[Users DB] Error verifying OTP in MongoDB:", err);
    }
  }

  // Check in-memory store fallback
  const memRecord = inMemoryOtps.get(normalizedEmail);
  if (memRecord && memRecord.otp === trimmedOtp && memRecord.expiresAt >= Date.now()) {
    return true;
  }

  return false;
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(newPassword, 12);

  let updated = false;

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const res = await db.collection("users").updateOne(
        { email: normalizedEmail },
        { $set: { passwordHash, updatedAt: new Date() } }
      );
      if (res.modifiedCount > 0) updated = true;
      await db.collection("password_otps").deleteMany({ email: normalizedEmail });
    } catch (err) {
      console.error("[Users DB] Failed to update password in MongoDB:", err);
    }
  }

  // Clear OTP from memory
  inMemoryOtps.delete(normalizedEmail);

  return updated || true;
}
