"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "violet" | "gold" | "rose" | "emerald";
  enableTilt?: boolean;
  tiltAmount?: number;
}

const glowColors = {
  violet: "rgba(139, 92, 246, 0.15)",
  gold: "rgba(229, 185, 127, 0.15)",
  rose: "rgba(244, 114, 182, 0.15)",
  emerald: "rgba(110, 231, 183, 0.15)",
};

export function GlowCard({
  children,
  className,
  glowColor = "violet",
  enableTilt = true,
  tiltAmount = 5,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltAmount, tiltAmount]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const glowStyle: MotionStyle = {
    background: useTransform(
      [springX, springY],
      ([x, y]) =>
        `radial-gradient(circle at ${50 + (x as number) * 100}% ${50 + (y as number) * 100}%, ${glowColors[glowColor]}, transparent 50%)`
    ),
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        enableTilt
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }
          : undefined
      }
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Glow effect layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={glowStyle}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Simple version without tilt for performance
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
