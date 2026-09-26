import { NextResponse } from "next/server";
import { findUserByEmail, savePasswordResetOtp } from "@/lib/users";
import { sendPasswordResetOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this email address." },
        { status: 404 }
      );
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database / memory
    await savePasswordResetOtp(normalizedEmail, otp);

    // Send OTP via email
    const emailResult = await sendPasswordResetOtpEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: `OTP verification code sent to ${normalizedEmail}`,
      devOtp: emailResult.devOtp, // Accessible in dev if SMTP is not configured
    });
  } catch (error) {
    console.error("[Forgot Password Request] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}
