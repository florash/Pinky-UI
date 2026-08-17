"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type BlurRevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  blur?: number;
  distance?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/** Content enters from a small blur and settles into focus. */
export function BlurReveal({
  children,
  delay = 0,
  duration = 0.58,
  blur = 8,
  distance = 18,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const animate = !motionEnabled || disabled || visible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={motionEnabled && !disabled ? { opacity: 0, y: distance, filter: `blur(${blur}px)` } : false}
      animate={animate ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}
