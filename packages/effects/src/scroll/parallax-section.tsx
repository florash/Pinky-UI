"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type ReactNode } from "react";

import { useViewportProgress } from "../internal/scroll-motion";

export type ParallaxSectionProps = {
  children?: ReactNode;
  background?: ReactNode;
  foreground?: ReactNode;
  /** Maximum vertical movement in px. Keep this restrained. */
  distance?: number;
  className?: string;
  disabled?: boolean;
};

/** Section-level scroll parallax with static content as the reduced-motion fallback. */
export function ParallaxSection({
  children,
  background,
  foreground,
  distance = 28,
  className,
  disabled = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;
  const progress = useViewportProgress(ref, active);
  const raw = useTransform(progress, (value) => (value - 0.5) * distance);
  const y = useSpring(raw, springs.soft);
  const backgroundY = useTransform(y, (value) => value * -0.65);
  const foregroundY = useTransform(y, (value) => value * 0.75);

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden" }}>
      {background ? (
        <motion.div aria-hidden style={{ position: "absolute", inset: -distance, pointerEvents: "none", y: active ? backgroundY : 0 }}>
          {background}
        </motion.div>
      ) : null}
      <motion.div style={{ position: "relative", zIndex: 1, y: active ? y : 0 }}>{children}</motion.div>
      {foreground ? (
        <motion.div style={{ position: "relative", zIndex: 2, y: active ? foregroundY : 0 }}>{foreground}</motion.div>
      ) : null}
    </div>
  );
}
