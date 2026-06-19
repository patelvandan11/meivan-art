import nodemailer from "nodemailer";

export async function sendMagicLinkEmail(email: string, magicLink: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/^["']|["']$/g, "").replace(/\s+/g, "");
  const from = process.env.SMTP_FROM || "Artisan Haven <noreply@artisanhaven.com>";

  if (!host || !user || !pass) {
    console.log("\n--- MAGIC LINK (SMTP not configured) ---");
    console.log(`Email: ${email}`);
    console.log(`Link:  ${magicLink}`);
    console.log("----------------------------------------\n");
    return { sent: false, devLink: magicLink };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your Artisan Haven sign-in link",
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #3d3028;">Sign in to Artisan Haven</h2>
        <p style="color: #5c4d42;">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${magicLink}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #c97c5d; color: white; text-decoration: none; border-radius: 999px;">
          Sign In
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
}
