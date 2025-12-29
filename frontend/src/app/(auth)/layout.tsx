"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingOrbs } from "@/components/motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_oklch(0.12_0.03_280)_0%,_oklch(0.06_0.02_280)_100%)]">
      {/* Floating background orbs */}
      <FloatingOrbs />

      {/* Noise overlay for texture */}
      <div className="noise-overlay pointer-events-none fixed inset-0" />

      {/* Top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      {/* Logo in top left */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-6 top-6"
      >
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]">
            <svg
              className="size-4 text-white"
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
          <span className="text-sm font-medium text-white">Interior AI</span>
        </Link>
      </motion.div>

      {/* Auth card container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
