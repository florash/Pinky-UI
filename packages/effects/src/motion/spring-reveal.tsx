"use client";

import { motion } from "motion/react";
import { springs, useMotionEnabled, type SpringPreset } from "@pinky/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type SpringRevealDirection = "up" | "down" | "left" | "right" | "scale";

export type SpringRevealProps = {
  children: ReactNode;
  direction?: SpringRevealDirection;
  distance?: number;
  scale?: number;
  preset?: SpringPreset;
  delay?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/** A generic entrance primitive using Pinky's shared spring vocabulary. */
export function SpringReveal({
  children,
  direction = "up",
  distance = 24,
  scale = 0.94,
  preset = "soft",
  delay = 0,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: SpringRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const animate = !motionEnabled || disabled || visible;
  const initial = initialFor(direction, distance, scale);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={motionEnabled && !disabled ? initial : false}
      animate={animate ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
      transition={{ type: "spring", ...springs[preset], delay: motionEnabled && !disabled ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

function initialFor(direction: SpringRevealDirection, distance: number, scale: number) {
  if (direction === "scale") return { opacity: 0, scale };
  if (direction === "down") return { opacity: 0, y: -distance };
  if (direction === "left") return { opacity: 0, x: distance };
  if (direction === "right") return { opacity: 0, x: -distance };
  return { opacity: 0, y: distance };
}
