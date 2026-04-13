"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleOAuthLogin = async (provider: "google") => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Return to your design workspace."
      subtitle="Pick up saved redesigns, review history, and continue generating from the same studio shell."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="rv-kicker">Welcome back</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em] text-[var(--rv-text)]">
            Sign in to Room Vision
          </h2>
          <p className="text-sm leading-7 text-[var(--rv-text-muted)]">
            Use Google for the fastest path or continue with email and password.
          </p>
        </div>

        {error && (
          <div className="rounded-[20px] bg-[rgba(186,26,26,0.08)] px-4 py-3 text-sm text-[#93000a]">
            {error}
          </div>
        )}

        <Button
          variant="secondary"
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className="h-12 w-full justify-center text-base"
        >
          <span className="inline-flex items-center">
            <svg className="mr-3 h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(191,200,204,0.3)]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-[var(--rv-text-soft)]">or</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--rv-text-muted)]">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-12 w-full rounded-2xl border border-[rgba(191,200,204,0.22)] bg-white px-4 text-[var(--rv-text)] placeholder:text-[var(--rv-text-soft)] focus:border-[var(--rv-primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(180,235,255,0.45)]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--rv-text-muted)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-2xl border border-[rgba(191,200,204,0.22)] bg-white px-4 text-[var(--rv-text)] placeholder:text-[var(--rv-text-soft)] focus:border-[var(--rv-primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(180,235,255,0.45)]"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="h-12 w-full text-base">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--rv-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[var(--rv-primary)]">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
