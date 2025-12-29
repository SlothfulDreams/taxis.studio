"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import {
  ArrowRight,
  Sparkles,
  Paintbrush,
  Wand2,
  Layers,
  CheckCircle2,
} from "lucide-react";

// Feature data with updated icons
const features = [
  {
    icon: <Paintbrush className="size-5" />,
    title: "Smart Masking",
    description:
      "Paint over areas you want to change. Precise control over every edit without affecting the rest of the room.",
  },
  {
    icon: <Wand2 className="size-5" />,
    title: "Natural Language",
    description:
      'Describe changes in plain English. "Make the sofa blue" or "Add a modern coffee table" just works.',
  },
  {
    icon: <Layers className="size-5" />,
    title: "Dual AI Models",
    description:
      "Combining GPT Image for precision with Gemini for speed. The best of both worlds for instant results.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              Interior AI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <FadeIn delay={0.05}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
                <span className="flex size-2">
                  <span className="animate-pulse inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  AI-Powered Design Tools
                </span>
              </div>
            </FadeIn>

            {/* Headline */}
            <FadeIn delay={0.1}>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl text-pretty">
                Transform any space{" "}
                <span className="text-muted-foreground">with precision</span>
              </h1>
            </FadeIn>

            {/* Subheadline */}
            <FadeIn delay={0.15}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
                Upload a photo, describe your vision, and watch AI reimagine
                your interior in seconds. Professional results without the
                professional cost.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button size="xl" className="group min-w-[180px]">
                    Start for free
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="min-w-[160px]">
                  View Gallery
                </Button>
              </div>
            </FadeIn>

            {/* Social proof */}
            <FadeIn delay={0.25} className="mt-10">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="size-6 rounded-full bg-muted border-2 border-background"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Sparkles
                        key={i}
                        className="size-3 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5</span>
                  <span className="opacity-50">from 2k+ users</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Preview Card */}
          <FadeIn delay={0.3} className="mt-16 lg:mt-24">
            <div className="relative mx-auto max-w-5xl">
              {/* Glow behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-3xl opacity-50" />

              <div className="relative rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="flex h-11 items-center gap-1.5 border-b border-border/50 bg-muted/30 px-4">
                  <div className="size-3 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="size-3 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
                <div className="aspect-[16/9] bg-muted/10 flex items-center justify-center">
                  <p className="text-muted-foreground">App Interface Preview</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Features Section */}
        <div className="mt-32 border-t border-border/40 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Built for speed and precision
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Professional-grade tools that make interior design accessible
                  to everyone. No complex software to learn.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid gap-8 sm:grid-cols-3">
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <div className="group h-full p-8 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors shadow-sm">
                    <div className="mb-6 inline-flex p-3 rounded-xl bg-primary/5 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-border/40">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <FadeIn>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to transform your space?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
                Join thousands of designers and homeowners using AI to visualize
                their dream interiors.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/sign-up">
                  <Button size="xl">Get started free</Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                No credit card required · Free trial included
              </p>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles className="size-3" />
              </div>
              <span className="text-sm font-medium">Interior AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Interior AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
