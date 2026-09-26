import { NextResponse } from "next/server";
import { verifyPasswordResetOtp, updateUserPassword } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, OTP code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const isValidOtp = await verifyPasswordResetOtp(email, otp);

    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP code. Please request a new code." },
        { status: 400 }
      );
    }

    // Update password
    await updateUserPassword(email, newPassword);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("[Forgot Password Verify] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
