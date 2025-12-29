"use client";

import {
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { type RefObject, useRef } from "react";

interface ScrollAnimationOptions {
  offset?: readonly [string, string][];
  smooth?: boolean;
  springConfig?: { stiffness: number; damping: number };
}

interface ScrollAnimationReturn {
  ref: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {},
): ScrollAnimationReturn {
  const {
    offset = [["start end", "end start"]] as const,
    smooth = true,
    springConfig = { stiffness: 100, damping: 30 },
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as unknown as ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const progress = smooth ? smoothProgress : scrollYProgress;

  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  const scale = useTransform(progress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  return { ref, scrollYProgress: progress, opacity, y, scale };
}
