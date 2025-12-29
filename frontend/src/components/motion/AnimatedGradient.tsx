"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  children?: ReactNode;
  className?: string;
  variant?: "mesh" | "radial" | "conic";
  speed?: number;
}

export function AnimatedGradient({
  children,
  className,
  variant = "mesh",
  speed = 1,
}: AnimatedGradientProps) {
  const time = useMotionValue(0);
  const smoothTime = useSpring(time, { damping: 100, stiffness: 10 });

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      time.set(time.get() + 0.01 * speed);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [time, speed]);

  const backgroundPosition = useTransform(
    smoothTime,
    (t) => `${Math.sin(t) * 50 + 50}% ${Math.cos(t) * 50 + 50}%`
  );

  const meshGradient = `
    radial-gradient(at 40% 20%, oklch(0.2 0.05 290) 0px, transparent 50%),
    radial-gradient(at 80% 0%, oklch(0.15 0.04 320) 0px, transparent 50%),
    radial-gradient(at 0% 50%, oklch(0.18 0.03 85) 0px, transparent 50%),
    radial-gradient(at 80% 50%, oklch(0.12 0.04 290) 0px, transparent 50%),
    radial-gradient(at 0% 100%, oklch(0.15 0.05 280) 0px, transparent 50%),
    radial-gradient(at 80% 100%, oklch(0.1 0.03 320) 0px, transparent 50%),
    oklch(0.08 0.02 280)
  `;

  const radialGradient = `
    radial-gradient(ellipse at center, oklch(0.15 0.04 290) 0%, oklch(0.08 0.02 280) 70%)
  `;

  const conicGradient = `
    conic-gradient(from 0deg at 50% 50%,
      oklch(0.12 0.03 280),
      oklch(0.15 0.05 290),
      oklch(0.12 0.04 320),
      oklch(0.1 0.03 85),
      oklch(0.12 0.03 280)
    )
  `;

  const gradients = {
    mesh: meshGradient,
    radial: radialGradient,
    conic: conicGradient,
  };

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: gradients[variant],
        backgroundSize: variant === "mesh" ? "200% 200%" : "100% 100%",
        backgroundPosition: variant === "mesh" ? backgroundPosition : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating orbs for background decoration
export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Violet orb */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, oklch(0.5 0.2 290) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        initial={{ top: "10%", left: "60%" }}
      />

      {/* Gold orb */}
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.15 85) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        initial={{ top: "50%", left: "10%" }}
      />

      {/* Rose orb */}
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.18 320) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        initial={{ bottom: "20%", right: "20%" }}
      />
    </div>
  );
}
