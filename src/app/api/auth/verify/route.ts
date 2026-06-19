import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";
import { setSessionCookie, toAuthUser } from "@/lib/auth";
import { consumeMagicToken } from "@/lib/users";
import { getDashboardPath } from "@/lib/dashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.redirect(new URL("/login?error=db", request.url));
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=token", request.url));
    }

    const user = await consumeMagicToken(token);
    if (!user) {
      return NextResponse.redirect(new URL("/login?error=expired", request.url));
    }

    const authUser = toAuthUser(user);
    await setSessionCookie(authUser);

    const dashboard = getDashboardPath(authUser.role);
    return NextResponse.redirect(new URL(dashboard, request.url));
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(new URL("/login?error=verify", request.url));
  }
}
