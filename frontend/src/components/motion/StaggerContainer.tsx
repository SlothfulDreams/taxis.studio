"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
}

const containerVariants = (
  staggerDelay: number,
  delayChildren: number
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const staggerItemScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.1,
  className,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "scale";
}) {
  return (
    <motion.div
      variants={variant === "scale" ? staggerItemScaleVariants : staggerItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Grid-specific stagger for project cards, etc.
export function StaggerGrid({
  children,
  className,
  columns = 3,
}: {
  children: ReactNode;
  className?: string;
  columns?: number;
}) {
  return (
    <motion.div
      variants={containerVariants(0.06, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </motion.div>
  );
}
