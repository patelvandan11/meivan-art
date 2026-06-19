"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore, getDashboardPath } from "@/store/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Registration failed");
        return;
      }

      setUser(data.user);
      router.push(getDashboardPath(data.user.role));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
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
        <h1 className="font-heading text-3xl font-semibold">Create Account</h1>
        <p className="mt-2 text-muted-foreground">Sign up to save wishlists and create albums.</p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="mt-1.5"
            />
          </div>
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-terracotta hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
