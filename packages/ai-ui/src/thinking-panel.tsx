"use client";

import { GridReveal, springs, useMotionEnabled, useReducedMotion } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "./internal/cn";

export type ThinkingPanelProps = {
  children: ReactNode;
  /** Still receiving reasoning tokens. Keeps the indicator pulsing and swaps the label. */
  thinking?: boolean;
  /** Seconds spent reasoning, shown in the label once `thinking` is false. */
  duration?: number;
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function ThinkingPanel({
  children,
  thinking = false,
  duration,
  label = "Thinking",
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
}: ThinkingPanelProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const motionEnabled = useMotionEnabled();
  const reducedMotion = useReducedMotion();
  const id = useId();

  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };

  const title = thinking ? label : duration != null ? `Thought for ${duration}s` : label;

  return (
    <div className={cn("rounded-2xl border border-line bg-cloud-50/60", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-sm font-medium text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
      >
        <span aria-hidden className={cn("size-2 rounded-full bg-cloud-300", thinking && motionEnabled ? "animate-pulse" : "")} />
        <span className="flex-1">{title}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
          className="text-ink-500"
        >
          ⌄
        </motion.span>
      </button>
      <GridReveal
        open={open}
        contentProps={{
          id,
          role: "region",
          "aria-label": label,
          style: { opacity: open ? 1 : 0, transition: reducedMotion ? "none" : "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)" },
        }}
      >
        <div className="px-4 pb-4 text-sm leading-relaxed text-ink-700">{children}</div>
      </GridReveal>
    </div>
  );
}
