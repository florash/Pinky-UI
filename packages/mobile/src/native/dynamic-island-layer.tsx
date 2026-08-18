"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type DynamicIslandState = "compact" | "expanded";

export type DynamicIslandLayerProps = {
  /** Content shown in the small pill state. */
  compact: ReactNode;
  /** Content shown once expanded. */
  expanded: ReactNode;
  state?: DynamicIslandState;
  defaultState?: DynamicIslandState;
  onStateChange?: (state: DynamicIslandState) => void;
  /** Describes what's live here — a call, a delivery, a download. */
  label?: string;
  className?: string;
};

/**
 * A floating status pill anchored to the safe-area top, morphing between a
 * compact and an expanded state — a live activity, a call, a download.
 * Tap toggles it when uncontrolled; pass `state`/`onStateChange` to drive it
 * from real progress instead.
 */
export function DynamicIslandLayer({
  compact,
  expanded,
  state: stateProp,
  defaultState = "compact",
  onStateChange,
  label = "Live activity",
  className,
}: DynamicIslandLayerProps) {
  const [uncontrolledState, setUncontrolledState] = useState<DynamicIslandState>(defaultState);
  const state = stateProp ?? uncontrolledState;
  const motionEnabled = useMotionEnabled();
  const id = useId();
  const isExpanded = state === "expanded";

  const toggle = () => {
    const next: DynamicIslandState = isExpanded ? "compact" : "expanded";
    setUncontrolledState(next);
    onStateChange?.(next);
  };

  return (
    <div
      className={cn("pointer-events-none fixed inset-x-0 z-[90] flex justify-center", className)}
      style={{ top: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <motion.button
        type="button"
        layout
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={id}
        aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
        transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
        className="pointer-events-auto flex min-h-11 items-center justify-center overflow-hidden rounded-pill bg-ink-900 px-4 text-sm text-milk shadow-xl"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            id={id}
            initial={motionEnabled ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionEnabled ? { duration: 0.15 } : { duration: 0 }}
          >
            {isExpanded ? expanded : compact}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
