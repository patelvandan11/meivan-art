import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isMongoConfigured } from "@/lib/mongodb";
import { getAppUrl } from "@/lib/env";
import { sendMagicLinkEmail } from "@/lib/email";
import { ensureSeedUsers, findUserByEmail, saveMagicToken } from "@/lib/users";

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

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();
    const user = await findUserByEmail(normalized);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please sign up first." },
        { status: 404 }
      );
    }

    const token = randomBytes(32).toString("hex");
    await saveMagicToken(normalized, token);

    const appUrl = getAppUrl();
    const magicLink = `${appUrl}/api/auth/verify?token=${token}`;

    const result = await sendMagicLinkEmail(normalized, magicLink);

    return NextResponse.json({
      success: true,
      message: result.sent
        ? "Magic link sent! Check your email."
        : "SMTP not configured — check server console for the magic link.",
      devLink: result.devLink,
    });
  } catch (error) {
    console.error("Magic link error:", error);
    const message =
      error instanceof Error && error.message.includes("ECONNREFUSED")
        ? "Cannot connect to MongoDB. Check MONGODB_URI and Atlas network access (allow 0.0.0.0/0)."
        : error instanceof Error
          ? error.message
          : "Failed to send magic link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
