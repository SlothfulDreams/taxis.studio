"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signIn("password", {
        email: trimmedEmail,
        password,
        flow: "signUp",
      });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Sign up error:", error);

      let errorMessage = "Failed to create account";
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("invalidsecret") ||
          msg.includes("already") ||
          msg.includes("exists") ||
          msg.includes("duplicate")
        ) {
          errorMessage =
            "An account with this email already exists. Try signing in instead.";
        } else if (msg.includes("invalid")) {
          errorMessage = "Please check your information and try again";
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      await signIn(provider);
    } catch (error) {
      console.error(`OAuth error (${provider}):`, error);
      toast.error(`Failed to sign up with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/[0.06] bg-[oklch(0.09_0.015_265)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

      <div className="mb-8 text-center">
        <h1 className="font-display text-xl font-bold tracking-tight text-white">
          Create an account
        </h1>
        <p className="mt-1.5 text-sm text-white/40">
          Get started with Interior AI
        </p>
      </div>

      <div className="mb-6 space-y-2.5">
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/[0.08] bg-white/[0.02] text-white/80 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading}
        >
          <svg
            className="mr-2 size-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full border-white/[0.08] bg-white/[0.02] text-white/80 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
        >
          <svg className="mr-2 size-4" viewBox="0 0 24 24" aria-hidden="true">
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
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[oklch(0.09_0.015_265)] px-3 text-white/30">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handlePasswordSignUp} className="space-y-3.5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium text-white/50"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 focus:border-white/[0.15] focus:bg-white/[0.04]"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium text-white/50"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 focus:border-white/[0.15] focus:bg-white/[0.04]"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-xs font-medium text-white/50"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 focus:border-white/[0.15] focus:bg-white/[0.04]"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="premium"
          className="!mt-5 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <motion.div
                className="size-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-[oklch(0.75_0.12_265)] transition-colors hover:text-[oklch(0.8_0.12_265)]"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-white/25">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
