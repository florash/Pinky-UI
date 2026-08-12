"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ContentSwapMotionProps = {
  value: string | number;
  children: ReactNode;
  direction?: "forward" | "backward";
  duration?: number;
  className?: string;
  disabled?: boolean;
};

/** Swaps a keyed content surface with a directional handoff, not an opacity-only crossfade. */
export function ContentSwapMotion({ value, children, direction = "forward", duration = 0.34, className, disabled = false }: ContentSwapMotionProps) {
  const enabled = useMotionEnabled() && !disabled;
  const sign = direction === "forward" ? 1 : -1;
  return (
    <div className={cn("relative", className)} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={String(value)}
          initial={enabled ? { opacity: 0, x: sign * 18, clipPath: "inset(0 0 0 12%)" } : false}
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
          exit={enabled ? { opacity: 0, x: sign * -18, clipPath: "inset(0 12% 0 0)" } : undefined}
          transition={enabled ? { duration, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
