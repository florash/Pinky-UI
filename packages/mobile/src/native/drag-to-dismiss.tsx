"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { triggerHaptic } from "../internal/haptics";

export type DragToDismissAxis = "vertical" | "horizontal" | "both";

export type DragToDismissProps = {
  children: ReactNode;
  onDismiss: () => void;
  axis?: DragToDismissAxis;
  /** Pixels of drag before release commits to dismissing. */
  threshold?: number;
  /** Fires on every drag frame with 0–1 progress — sync a sibling backdrop's fade or scale to it. */
  onProgress?: (progress: number) => void;
  className?: string;
};

const DRAG_AXIS: Record<DragToDismissAxis, "x" | "y" | true> = { horizontal: "x", vertical: "y", both: true };

/**
 * Wraps any full-screen overlay — a photo, a card, a modal — with a
 * drag-to-dismiss gesture: the content follows the finger and scales down
 * slightly, then snaps back or commits past `threshold`.
 *
 * This owns only the foreground content's transform. `onProgress` is how a
 * sibling backdrop (the page scaling or dimming behind the overlay) stays in
 * sync, so one drag gesture can drive two independent layers.
 */
export function DragToDismiss({ children, onDismiss, axis = "vertical", threshold = 120, onProgress, className }: DragToDismissProps) {
  const motionEnabled = useMotionEnabled();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform([x, y], ([xValue, yValue]: number[]) => Math.max(0.88, 1 - Math.hypot(xValue ?? 0, yValue ?? 0) / 1600));
  const committed = useRef(false);

  if (!motionEnabled) {
    // No gesture in reduced motion: the overlay stays put. Dismissal is left
    // entirely to an explicit control the consumer renders alongside this.
    return <div className={className}>{children}</div>;
  }

  const distanceFrom = (info: PanInfo) =>
    axis === "horizontal" ? Math.abs(info.offset.x) : axis === "vertical" ? Math.abs(info.offset.y) : Math.hypot(info.offset.x, info.offset.y);

  return (
    <motion.div
      drag={DRAG_AXIS[axis]}
      dragElastic={0.15}
      dragMomentum={false}
      style={{ x, y, scale, touchAction: "none" }}
      onDrag={(_, info) => {
        const progress = Math.min(1, distanceFrom(info) / threshold);
        onProgress?.(progress);
        if (progress >= 1 && !committed.current) {
          committed.current = true;
          triggerHaptic("light");
        } else if (progress < 1) {
          committed.current = false;
        }
      }}
      onDragEnd={(_, info) => {
        if (distanceFrom(info) >= threshold) {
          onProgress?.(1);
          onDismiss();
        } else {
          onProgress?.(0);
          x.set(0);
          y.set(0);
        }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={cn("touch-none", className)}
    >
      {children}
    </motion.div>
  );
}
