"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingOrbs,
  GlowCard,
} from "@/components/motion";

// Animation variants
const heroTextVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const features = [
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Smart Masking",
    description:
      "Paint over areas you want to change and let AI do the rest. Precise control over what gets edited.",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    title: "Natural Language",
    description:
      'Describe changes in plain English. "Make the sofa blue" or "Add more plants" - it just works.',
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: (
      <svg
        className="size-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Multiple AI Models",
    description:
      "Choose between GPT Image for precision or Gemini for speed. Best of both worlds.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
];

function AnimatedText({ text }: { text: string }) {
  return (
    <motion.span variants={heroTextVariants} initial="hidden" animate="visible">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
      {/* Floating background orbs */}
      <FloatingOrbs />

      {/* Noise overlay for texture */}
      <div className="noise-overlay pointer-events-none fixed inset-0" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 px-6 py-3 backdrop-blur-2xl"
          >
            <Link href="/" className="group flex items-center gap-3">
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
              <span className="text-lg font-semibold text-white">
                Interior AI
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="premium" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Headline with animated text */}
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                Transform Your Space with{" "}
                <span className="gradient-text">AI-Powered Design</span>
              </h1>
            </FadeIn>

            {/* Subheadline */}
            <FadeIn delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-400">
                Upload a photo of any room and watch AI reimagine it in seconds.
                Change furniture, colors, styles, and more with simple text
                prompts.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up">
                  <Button variant="premium" size="xl" className="group">
                    Start Designing Free
                    <motion.svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </Button>
                </Link>
                <Button variant="glass" size="xl">
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Watch Demo
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Feature Preview */}
          <FadeIn delay={0.4} className="mt-20 lg:mt-28">
            <motion.div
              className="relative mx-auto max-w-5xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Glow effect behind the card */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 opacity-50 blur-3xl" />

              {/* Main preview card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl border-gradient-animated" />

                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
                  {/* Placeholder for app preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 backdrop-blur-xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          className="size-10 text-violet-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-slate-500">App Preview</p>
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Features Section */}
        <div className="relative border-t border-white/[0.06] bg-gradient-to-b from-transparent to-slate-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <FadeIn>
              <h2 className="text-center text-3xl sm:text-4xl font-bold text-white">
                Powerful Features
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
                Everything you need to reimagine any space with AI
              </p>
            </FadeIn>

            <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <GlowCard
                    className="group h-full p-6"
                    glowColor={
                      index === 0 ? "violet" : index === 1 ? "gold" : "emerald"
                    }
                  >
                    <div
                      className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                    >
                      <div className={feature.iconColor}>{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-slate-400">{feature.description}</p>
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative border-t border-white/[0.06]">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Ready to Transform Your Space?
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
                Join thousands of designers and homeowners using AI to visualize
                their dream spaces.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link href="/sign-up" className="mt-8 inline-block">
                <Button variant="premium" size="xl">
                  Get Started for Free
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
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
              <span className="text-sm text-slate-400">Interior AI</span>
            </div>
            <p className="text-sm text-slate-500">
              Powered by OpenAI GPT Image & Google Gemini
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
