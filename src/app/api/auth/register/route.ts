import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";
import { setSessionCookie, toAuthUser } from "@/lib/auth";
import { createUser, ensureSeedUsers } from "@/lib/users";

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

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, password, role: "user" });
    const authUser = toAuthUser(user);
    await setSessionCookie(authUser);

    return NextResponse.json({ user: authUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
