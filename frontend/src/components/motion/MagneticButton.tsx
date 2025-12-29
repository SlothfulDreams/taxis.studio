"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "div" | "a";
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  as = "button",
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 500, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const commonProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style: { x: springX, y: springY },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    className: cn("inline-block", className),
  };

  if (as === "a") {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...commonProps}
      >
        {children}
      </motion.a>
    );
  }

  if (as === "div") {
    return (
      <motion.div ref={ref as React.RefObject<HTMLDivElement>} {...commonProps}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...commonProps}
    >
      {children}
    </motion.button>
  );
}

// Text-only magnetic effect (for nav links etc.)
export function MagneticText({
  children,
  className,
  strength = 0.15,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 25 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
