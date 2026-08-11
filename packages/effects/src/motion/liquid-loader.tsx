"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { type CSSProperties } from "react";

export type LiquidLoaderProps = {
  label?: string;
  size?: number;
  color?: string;
  track?: string;
  variant?: "dots" | "blob" | "pill";
  progress?: number;
  className?: string;
  disabled?: boolean;
};

/** A small loading indicator with a static, accessible reduced-motion state. */
export function LiquidLoader({
  label = "Loading",
  size = 28,
  color = "var(--color-blush-300)",
  track = "color-mix(in oklab, var(--color-ink-900) 12%, transparent)",
  variant = "dots",
  progress,
  className,
  disabled = false,
}: LiquidLoaderProps) {
  const motionEnabled = useMotionEnabled();
  const animate = motionEnabled && !disabled;

  if (variant === "pill") {
    const value = progress === undefined ? 0.42 : Math.min(Math.max(progress, 0), 1);
    return (
      <div
        className={className}
        role="status"
        aria-label={label}
        aria-busy="true"
        style={{ width: size * 2.4, height: Math.max(size * 0.34, 5), borderRadius: 999, background: track, overflow: "hidden" }}
      >
        <motion.div
          style={{ height: "100%", originX: 0, background: color, borderRadius: 999 }}
          initial={animate ? { scaleX: 0 } : false}
          animate={{ scaleX: value }}
          transition={{ duration: animate ? 0.55 : 0 }}
        />
      </div>
    );
  }

  const dotStyle: CSSProperties = {
    width: size * 0.28,
    height: size * 0.28,
    borderRadius: "50%",
    background: color,
  };

  return (
    <div
      className={className}
      role="status"
      aria-label={label}
      aria-busy="true"
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.13, minHeight: size }}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          aria-hidden
          style={variant === "blob" ? { ...dotStyle, borderRadius: "48% 52% 54% 46%" } : dotStyle}
          animate={animate ? { y: [0, -size * 0.18, 0], scale: [1, 1.14, 1] } : { y: 0, scale: 1 }}
          transition={animate ? { duration: 0.8, repeat: Infinity, delay: index * 0.1, ease: "easeInOut" } : { duration: 0 }}
        />
      ))}
    </div>
  );
}
