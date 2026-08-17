"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "./internal/cn";

export type StreamingActionsProps = {
  state: "idle" | "streaming";
  onStop: () => void;
  onRegenerate: () => void;
  className?: string;
};

/** One button that morphs between "Stop" and "Regenerate" as a response streams in and finishes. */
export function StreamingActions({ state, onStop, onRegenerate, className }: StreamingActionsProps) {
  const motionEnabled = useMotionEnabled();
  const id = useId();
  const streaming = state === "streaming";
  const transition = motionEnabled ? { type: "spring" as const, ...springs.snappy } : { duration: 0 };

  return (
    <button
      type="button"
      onClick={streaming ? onStop : onRegenerate}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-pill border border-line bg-white px-3.5 text-sm font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20",
        className,
      )}
    >
      <motion.span
        aria-hidden
        layout
        layoutId={`${id}-icon`}
        transition={transition}
        className={cn("block", streaming ? "size-2.5 rounded-[3px] bg-ink-900" : "size-2.5 rounded-full border-[1.5px] border-ink-900")}
      />
      <motion.span layout transition={transition}>
        {streaming ? "Stop" : "Regenerate"}
      </motion.span>
    </button>
  );
}
