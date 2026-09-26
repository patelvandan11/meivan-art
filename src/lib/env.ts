/**
 * Resolves the public app URL for redirects, magic links, and Stripe.
 * On Vercel, VERCEL_URL is set automatically (e.g. my-app.vercel.app).
 */
export function getAppUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (request) {
    const origin = request.headers.get("origin");
    if (origin) return origin.replace(/\/$/, "");

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set in environment variables`);
  }
  return value;
}
