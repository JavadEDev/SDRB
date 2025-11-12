"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreeToTerms) {
      setError("You must agree to the Terms and Conditions and Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, passwordConfirm }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to sign up");
      }
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignUp(provider: string) {
    setError(null);
    setLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err: any) {
      setError(err.message || "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to homepage link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-text)] hover:text-[var(--text)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to homepage</span>
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Sign Up</h1>
        <p className="text-sm text-[var(--muted-text)] mb-8">
          Enter your email and password to sign up!
        </p>

        {/* Social Login Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] hover:bg-[var(--muted-bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span className="text-sm font-medium text-[var(--text)]">Sign up with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignUp("facebook")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] hover:bg-[var(--muted-bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm font-medium text-[var(--text)]">Sign up with Facebook</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--input-border)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--bg)] text-[var(--muted-text)]">Or</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={onSubmit} className="space-y-5">
        <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1" htmlFor="firstName">
              First Name <span className="text-[var(--action-destructive-bg)]">*</span>
          </label>
          <input
            id="firstName"
            type="text"
              className="w-full rounded-md border border-[var(--input-border)] px-3 py-2.5 bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:border-transparent"
              placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1" htmlFor="lastName">
              Last Name <span className="text-[var(--action-destructive-bg)]">*</span>
          </label>
          <input
            id="lastName"
            type="text"
              className="w-full rounded-md border border-[var(--input-border)] px-3 py-2.5 bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:border-transparent"
              placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
        <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1" htmlFor="password">
              Password <span className="text-[var(--action-destructive-bg)]">*</span>
          </label>
            <div className="relative">
          <input
            id="password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md border border-[var(--input-border)] px-3 py-2.5 pr-10 bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:border-transparent"
                placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--text)]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-[var(--muted-text)] mt-1">
            At least 8 chars, include upper, lower, number, and special char.
          </p>
        </div>
        <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1" htmlFor="passwordConfirm">
              Confirm Password <span className="text-[var(--action-destructive-bg)]">*</span>
          </label>
          <input
            id="passwordConfirm"
            type="password"
              className="w-full rounded-md border border-[var(--input-border)] px-3 py-2.5 bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)] focus:border-transparent"
              placeholder="Confirm your password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[var(--action-primary-bg)] border-[var(--input-border)] rounded focus:ring-[var(--input-focus-border)]"
              />
              <span className="text-sm text-[var(--text)]">
                By creating an account means you agree to the{" "}
                <Link href="/terms" className="font-semibold text-[var(--action-primary-bg)] hover:opacity-80 hover:underline">
                  Terms and Conditions
                </Link>
                , and our{" "}
                <Link href="/privacy" className="font-semibold text-[var(--action-primary-bg)] hover:opacity-80 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
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
            {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
          Already have an account?{" "}
          <Link className="text-[var(--action-primary-bg)] hover:opacity-80 hover:underline font-medium" href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}


