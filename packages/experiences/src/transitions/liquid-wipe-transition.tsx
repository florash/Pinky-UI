"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type LiquidWipeDirection = "left" | "right" | "up" | "down";

export type LiquidWipeTransitionProps = {
  children: ReactNode;
  transitionKey: string | number;
  direction?: LiquidWipeDirection;
  color?: string;
  secondaryColor?: string;
  duration?: number;
  focusOnChange?: boolean;
  className?: string;
  disabled?: boolean;
};

/** A short two-layer transform wipe; no fluid filters or simulation. */
export function LiquidWipeTransition({
  children,
  transitionKey,
  direction = "right",
  color = "var(--color-blush-200)",
  secondaryColor = "var(--color-cloud-100)",
  duration = 0.58,
  focusOnChange = true,
  className,
  disabled = false,
}: LiquidWipeTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(transitionKey);
  const [wipe, setWipe] = useState(0);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  useEffect(() => {
    if (previous.current === transitionKey) return;
    previous.current = transitionKey;
    if (active) setWipe((value) => value + 1);
    else if (focusOnChange) ref.current?.focus({ preventScroll: true });
  }, [active, focusOnChange, transitionKey]);

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? 1 : -1;
  const travel = [sign * -112, 0, 0, sign * 112];

  return (
    <div ref={ref} tabIndex={-1} className={cn("relative isolate overflow-hidden", className)}>
      {children}
      {active && wipe > 0 ? (
        <motion.div
          key={wipe}
          aria-hidden
          style={{ position: "absolute", inset: "-12%", zIndex: 30, pointerEvents: "none", borderRadius: "44% 56% 38% 62% / 54% 40% 60% 46%", background: color }}
          initial={axis === "x" ? { x: `${travel[0]}%` } : { y: `${travel[0]}%` }}
          animate={axis === "x" ? { x: travel.map((value) => `${value}%`) } : { y: travel.map((value) => `${value}%`) }}
          transition={{ duration, times: [0, 0.42, 0.58, 1], ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (focusOnChange) ref.current?.focus({ preventScroll: true });
          }}
        >
          <div style={{ position: "absolute", inset: "8%", borderRadius: "58% 42% 60% 40% / 42% 58% 42% 58%", background: secondaryColor, opacity: 0.55 }} />
        </motion.div>
      ) : null}
    </div>
  );
}
