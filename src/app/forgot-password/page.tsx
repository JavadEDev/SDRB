"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to signin link */}
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-text)] hover:text-[var(--text)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Forgot Password</h1>
        <p className="text-sm text-[var(--muted-text)] mb-8">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {success ? (
          <div className="space-y-6">
            <div className="rounded-md bg-[var(--muted-bg)] border border-[var(--action-primary-bg)]/30 px-4 py-3">
              <p className="text-sm text-[var(--text)]">
                If an account with that email exists, we&apos;ve sent you a password reset link.
                Please check your inbox.
              </p>
            </div>
            <Link
              href="/signin"
              className="block w-full text-center rounded-md bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] px-4 py-2.5 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:ring-offset-2 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1" htmlFor="email">
                Email <span className="text-[var(--action-destructive-bg)]">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-[var(--input-border)] px-3 py-2.5 bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--action-destructive-text)] bg-[var(--action-destructive-bg)]/10 border border-[var(--action-destructive-bg)]/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] px-4 py-2.5 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
          Remember your password?{" "}
          <Link className="text-[var(--action-primary-bg)] hover:opacity-80 hover:underline font-medium" href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

