"use client";

import { motion, useMotionTemplate, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";

export type CursorBlobProps = {
  /** Diameter, in px. This is ambient — it is supposed to be large. */
  size?: number;
  color?: string;
  /** Peak opacity, 0–1. Keep it low enough to read text through. */
  opacity?: number;
  /** Softness of the edge, in px. */
  blur?: number;
  /**
   * Behind the page content by default. Only raise it above content for a
   * deliberately atmospheric section, and lower the opacity if you do.
   */
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A large, slow, organic shape that drifts after the pointer.
 *
 * Ambient rather than interactive: it does not indicate anything, and it must
 * never look like it does. It lags far enough behind the pointer that nobody
 * mistakes it for a cursor, sits behind the content, and never takes pointer
 * events.
 *
 * One blurred element, not a filter stack. A single `blur()` on a compositor
 * layer is cheap; a page of gooey SVG filters is not.
 */
export function CursorBlob({
  size = 320,
  color = "var(--color-blush-200)",
  opacity = 0.5,
  blur = 60,
  zIndex = -1,
  disabled = false,
}: CursorBlobProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(active);

  // Deliberately slower than any other follower in the family.
  const drift = { stiffness: 60, damping: 22, mass: 1.4 };
  const x = useSpring(pointer.x, drift);
  const y = useSpring(pointer.y, drift);
  const left = useTransform(x, (value) => value - size / 2);
  const top = useTransform(y, (value) => value - size / 2);

  // The shape leans with speed rather than deforming per frame: two of the four
  // radii open up, which reads as a blob being pulled rather than a squashed
  // circle.
  const lean = useTransform(pointer.speed, [0, 2200], [0, 18], { clamp: true });
  const a = useSpring(useTransform(lean, (value) => 50 + value), springs.soft);
  const b = useSpring(useTransform(lean, (value) => 50 - value), springs.soft);
  const radius = useMotionTemplate`${a}% ${b}% ${a}% ${b}% / ${b}% ${a}% ${b}% ${a}%`;

  const presence = useSpring(pointer.presence, springs.soft);
  const fade = useTransform(presence, (value) => value * opacity);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex,
        width: size,
        height: size,
        pointerEvents: "none",
        background: color,
        filter: `blur(${blur}px)`,
        borderRadius: radius,
        x: left,
        y: top,
        opacity: fade,
      }}
    />
  );
}
