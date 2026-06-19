"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore, getDashboardPath } from "@/store/auth-store";

type Tab = "password" | "magic";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, loading } = useAuthStore();
  const [tab, setTab] = useState<Tab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (errorParam === "expired") setMessage("Magic link expired. Please request a new one.");
    if (errorParam === "token") setMessage("Invalid magic link.");
  }, [errorParam]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Login failed");
        return;
      }

      setUser(data.user);
      router.push(getDashboardPath(data.user.role));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setDevLink("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send magic link");
        return;
      }

      setStatus("sent");
      setMessage(data.message);
      if (data.devLink) setDevLink(data.devLink);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
        <h1 className="font-heading text-3xl font-semibold">Sign In</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in with your email and password, or use a magic link.
        </p>

        <div className="mt-8 flex rounded-full border border-border bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("password")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
              tab === "password" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Lock className="h-4 w-4" />
            Password
          </button>
          <button
            type="button"
            onClick={() => setTab("magic")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
              tab === "magic" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Mail className="h-4 w-4" />
            Magic Link
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "error" ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        )}

        {devLink && (
          <a
            href={devLink}
            className="mt-2 block break-all text-sm text-terracotta hover:underline"
          >
            Click here to sign in (dev mode)
          </a>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-terracotta hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}
