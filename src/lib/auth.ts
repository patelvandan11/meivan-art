import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AuthUser, UserRole } from "@/types";

const COOKIE_NAME = "artisan-haven-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === "development" ? "dev-only-auth-secret-change-me" : "")
  );
}

function getSecret() {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is not set in environment variables");
  }
  return new TextEncoder().encode(secret);
}

export interface DbUser {
  _id: import("mongodb").ObjectId;
  email: string;
  name: string;
  passwordHash?: string;
  role: UserRole;
  artistSlug?: string;
  createdAt: Date;
}

export function toAuthUser(user: DbUser): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    artistSlug: user.artistSlug,
  };
}

export async function createSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    artistSlug: user.artistSlug,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name || "User"),
      role: payload.role as UserRole,
      artistSlug: payload.artistSlug ? String(payload.artistSlug) : undefined,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: AuthUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
