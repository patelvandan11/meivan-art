import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isMongoConfigured } from "@/lib/mongodb";
import { setSessionCookie, toAuthUser } from "@/lib/auth";
import { ensureSeedUsers, findUserByEmail } from "@/lib/users";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Set MONGODB_URI in .env" },
        { status: 503 }
      );
    }

    await ensureSeedUsers();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const authUser = toAuthUser(user);
    await setSessionCookie(authUser);

    return NextResponse.json({ user: authUser });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
