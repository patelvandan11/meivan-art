"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, KeyRound, CheckCircle2, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setDevOtp(null);

    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Failed to send OTP.");
        return;
      }

      setStatus("idle");
      setMessage(data.message);
      if (data.devOtp) setDevOtp(data.devOtp);
      setStep(2);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Invalid OTP code.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setStep(3);
    } catch {
      setStatus("error");
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-terracotta" />
          Artisan Haven
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>

        {step === 1 && (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-semibold">Forgot Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your registered email address and we&apos;ll send you a 6-digit OTP code to reset your password.
            </p>

            <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative mt-1.5">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending OTP Code..." : "Send OTP Code"}
              </Button>
            </form>

            {status === "error" && message && (
              <p className="mt-4 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                {message}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-semibold">Enter OTP Code</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
            </p>

            {devOtp && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Dev Mode OTP:</strong> <code className="font-mono text-sm font-bold">{devOtp}</code>
                </span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">6-Digit OTP Code</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  maxLength={6}
                  required
                  className="mt-1.5 font-mono text-center tracking-widest text-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative mt-1.5">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative mt-1.5">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Verifying & Updating..." : "Reset Password"}
              </Button>
            </form>

            {status === "error" && message && (
              <p className="mt-4 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                {message}
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-terracotta hover:underline"
              >
                Didn&apos;t receive code? Resend OTP
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-3xl font-semibold">Password Reset Complete!</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your password has been updated successfully. You can now sign in with your new credentials.
            </p>

            <Button onClick={() => router.push("/login")} className="mt-8 w-full">
              Sign In Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
