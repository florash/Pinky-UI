"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type ScrollRevealProps = {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  distance?: number;
  delay?: number;
  duration?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/** A compact viewport-triggered reveal that shares the global observer pool. */
export function ScrollReveal({
  children,
  direction = "up",
  distance = 20,
  delay = 0,
  duration = 0.5,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const animate = !motionEnabled || disabled || visible;
  const initial = initialFor(direction, distance);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={motionEnabled && !disabled ? initial : false}
      animate={animate ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
      transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function initialFor(direction: ScrollRevealProps["direction"], distance: number) {
  if (direction === "scale") return { opacity: 0, scale: 0.95 };
  if (direction === "down") return { opacity: 0, y: -distance };
  if (direction === "left") return { opacity: 0, x: distance };
  if (direction === "right") return { opacity: 0, x: -distance };
  return { opacity: 0, y: distance };
}
