"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type SurfaceCompressionProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

/** A tactile press changes elevation and inset depth before it changes scale. */
export function SurfaceCompression({ children, className, disabled = false }: SurfaceCompressionProps) {
  const enabled = useMotionEnabled() && !disabled;
  const [pressed, setPressed] = useState(false);
  const set = (value: boolean) => {
    if (!disabled) setPressed(value);
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") set(true);
  };

  return (
    <motion.div
      data-pressed={pressed ? "true" : "false"}
      className={cn("relative rounded-2xl", className)}
      animate={enabled ? { y: pressed ? 2 : 0, scale: pressed ? 0.995 : 1, boxShadow: pressed ? "0 2px 0 rgba(52, 45, 48, 0.12), inset 0 1px 2px rgba(52, 45, 48, 0.1)" : "0 12px 24px rgba(52, 45, 48, 0.10), inset 0 0 0 rgba(52, 45, 48, 0)" } : { y: 0, scale: 1 }}
      transition={enabled ? { type: "spring", stiffness: 520, damping: 34 } : { duration: 0 }}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse" || event.button === 0) set(true);
      }}
      onPointerUp={() => set(false)}
      onPointerCancel={() => set(false)}
      onPointerLeave={() => set(false)}
      onFocusCapture={() => set(true)}
      onBlurCapture={() => set(false)}
      onKeyDown={keyDown}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") set(false);
      }}
    >
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset transition-colors" style={{ boxShadow: pressed ? "inset 0 1px 3px rgba(52, 45, 48, 0.12)" : "inset 0 0 0 rgba(52, 45, 48, 0)", borderColor: "transparent" }} />
    </motion.div>
  );
}
