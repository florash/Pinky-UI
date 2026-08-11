"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type MaskRevealDirection = "left" | "right" | "up" | "down" | "center";

export type MaskRevealProps = {
  children: ReactNode;
  direction?: MaskRevealDirection;
  duration?: number;
  delay?: number;
  scale?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/** Reveals media or editorial content through a restrained clipping mask. */
export function MaskReveal({
  children,
  direction = "up",
  duration = 0.72,
  delay = 0,
  scale = 1.035,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const animate = !motionEnabled || disabled || visible;

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        initial={motionEnabled && !disabled ? { clipPath: maskFor(direction), scale } : false}
        animate={animate ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined}
        transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function maskFor(direction: MaskRevealDirection) {
  if (direction === "left") return "inset(0% 0% 0% 100%)";
  if (direction === "right") return "inset(0% 100% 0% 0%)";
  if (direction === "down") return "inset(100% 0% 0% 0%)";
  if (direction === "center") return "inset(50% 50% 50% 50%)";
  return "inset(0% 0% 100% 0%)";
}
