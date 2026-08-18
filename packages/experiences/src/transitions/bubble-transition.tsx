"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

import { cn } from "../internal/cn";

export type TransitionOrigin = "center" | { x: number; y: number } | RefObject<HTMLElement | null>;

export type BubbleTransitionProps = {
  children: ReactNode;
  transitionKey: string | number;
  origin?: TransitionOrigin;
  color?: string;
  duration?: number;
  focusOnChange?: boolean;
  className?: string;
  disabled?: boolean;
};

/** A soft circular cover/reveal initiated from a trigger, coordinates or centre. */
export function BubbleTransition({
  children,
  transitionKey,
  origin = "center",
  color = "var(--color-blush-200)",
  duration = 0.64,
  focusOnChange = true,
  className,
  disabled = false,
}: BubbleTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(transitionKey);
  const [pulse, setPulse] = useState(0);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  useEffect(() => {
    if (previous.current === transitionKey) return;
    previous.current = transitionKey;
    const box = ref.current?.getBoundingClientRect();
    let x = (box?.width ?? 0) / 2;
    let y = (box?.height ?? 0) / 2;

    if (origin !== "center") {
      if ("current" in origin) {
        const trigger = origin.current?.getBoundingClientRect();
        if (trigger) {
          x = trigger.left + trigger.width / 2 - (box?.left ?? 0);
          y = trigger.top + trigger.height / 2 - (box?.top ?? 0);
        }
      } else {
        x = origin.x - (box?.left ?? 0);
        y = origin.y - (box?.top ?? 0);
      }
    }
    setPoint({ x, y });
    if (active) setPulse((value) => value + 1);
    else if (focusOnChange) ref.current?.focus({ preventScroll: true });
  }, [active, focusOnChange, origin, transitionKey]);

  const circle = (size: string) => `circle(${size} at ${point.x}px ${point.y}px)`;

  return (
    <div ref={ref} tabIndex={-1} className={cn("relative isolate overflow-hidden", className)}>
      {children}
      {active && pulse > 0 ? (
        <motion.div
          key={pulse}
          aria-hidden
          style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none", background: color }}
          initial={{ clipPath: circle("0px") }}
          animate={{ clipPath: [circle("0px"), circle("150vmax"), circle("150vmax"), circle("0px")] }}
          transition={{ duration, times: [0, 0.42, 0.58, 1], ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (focusOnChange) ref.current?.focus({ preventScroll: true });
          }}
        />
      ) : null}
    </div>
  );
}
