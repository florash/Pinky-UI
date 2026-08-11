"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type BlurRouteTransitionProps = {
  children: ReactNode;
  transitionKey: string | number;
  duration?: number;
  blur?: number;
  focusOnChange?: boolean;
  className?: string;
  disabled?: boolean;
};

/** The production-friendly route/content transition: slight blur and fade. */
export function BlurRouteTransition({
  children,
  transitionKey,
  duration = 0.24,
  blur = 5,
  focusOnChange = true,
  className,
  disabled = false,
}: BlurRouteTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!focusOnChange) return;
    const timer = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), active ? duration * 1000 : 0);
    return () => window.clearTimeout(timer);
  }, [active, duration, focusOnChange, transitionKey]);

  return (
    <div ref={ref} tabIndex={-1} className={cn("relative", className)}>
      {active ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, filter: `blur(${blur}px)`, y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: `blur(${Math.max(blur * 0.6, 1)}px)`, y: -3 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div key={transitionKey}>{children}</div>
      )}
    </div>
  );
}
