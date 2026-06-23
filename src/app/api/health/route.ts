// import { NextResponse } from "next/server";
// import { isMongoConfigured } from "@/lib/mongodb";
// import { getAppUrl } from "@/lib/env";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   const checks = {
//     appUrl: getAppUrl(),
//     mongodb: isMongoConfigured(),
//     authSecret: Boolean(process.env.AUTH_SECRET),
//     smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
//     stripe: Boolean(process.env.STRIPE_SECRET_KEY),
//   };

//   const healthy = checks.mongodb && checks.authSecret;

//   return NextResponse.json(
//     {
//       status: healthy ? "ok" : "degraded",
//       checks,
//       timestamp: new Date().toISOString(),
//     },
//     { status: healthy ? 200 : 503 }
//   );
// }
