"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

export type SpringProps = {
  children: ReactNode;
  /** Scale while hovered or keyboard-focused. */
  hoverScale?: number;
  /** Scale while pressed. */
  pressScale?: number;
  /** Vertical lift while hovered, in px. Negative moves up. */
  lift?: number;
  preset?: SpringPreset;
  className?: string;
  disabled?: boolean;
};

/**
 * The smallest useful piece of Pinky's motion language: spring-driven hover
 * and press feedback, applied to whatever it wraps.
 *
 * Focus is included deliberately — keyboard users should get the same feedback
 * a pointer gets.
 */
export function Spring({
  children,
  hoverScale = 1.03,
  pressScale = 0.97,
  lift = 0,
  preset = "snappy",
  className,
  disabled = false,
}: SpringProps) {
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const raised = { scale: hoverScale, y: lift };

  // Always the same element type: switching between a plain div and a motion
  // div when the media query resolves would remount the subtree and drop focus.
  return (
    <motion.div
      className={className}
      whileHover={active ? raised : undefined}
      whileFocus={active ? raised : undefined}
      whileTap={active ? { scale: pressScale, y: 0 } : undefined}
      transition={{ type: "spring", ...springs[preset] }}
    >
      {children}
    </motion.div>
  );
}
