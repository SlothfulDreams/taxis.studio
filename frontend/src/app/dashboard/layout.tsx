"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
        <motion.div
          className="size-10 rounded-full border-2 border-violet-500/30 border-t-violet-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
        <div className="absolute -right-20 bottom-40 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-900/60 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="group flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <svg
                  className="size-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">Interior AI</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {/* Avatar with gradient ring */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-75" />
                    <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-sm font-medium text-white">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="size-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"
                      )}
                    </div>
                  </div>
                  <span className="hidden text-slate-200 sm:inline">
                    {user?.name || user?.email}
                  </span>
                  <svg
                    className="size-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-slate-900/95 p-1 shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem className="cursor-pointer rounded-lg text-slate-300 focus:bg-white/[0.06] focus:text-white">
                  <svg
                    className="mr-2 size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer rounded-lg text-red-400 focus:bg-red-500/10 focus:text-red-300"
                >
                  <svg
                    className="mr-2 size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
