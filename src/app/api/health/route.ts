import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";
import { getAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    appUrl: getAppUrl(),
    mongodb: isMongoConfigured(),
    authSecret: Boolean(process.env.AUTH_SECRET),
    smtp: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    payu: Boolean(process.env.PAYU_MERCHANT_KEY && process.env.PAYU_MERCHANT_SALT),
    googleSheets: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_ID),
  };

  const healthy = checks.authSecret;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      service: "Meivan Art E-Commerce Platform",
      adminEmail: "vandan11patel@gmail.com",
      orderNotificationEmail: "meivaninfo@gmail.com",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
