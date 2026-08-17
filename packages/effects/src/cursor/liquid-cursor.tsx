"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";

export type LiquidCursorProps = {
  /** Resting diameter, in px. */
  size?: number;
  /** How far it stretches at full speed, 0–1. Above ~0.5 it reads as a smear. */
  stretch?: number;
  /** Speed in px/s at which stretch is maximal. */
  maxSpeed?: number;
  color?: string;
  /** Draw a filled blob instead of an outline. */
  filled?: boolean;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A cursor follower that deforms with speed and springs back to a circle.
 *
 * Squash and stretch is the oldest trick in animation and the reason this feels
 * like a physical object rather than a moving div: the blob elongates along its
 * direction of travel, thins across it, and recovers when you stop.
 *
 * Deliberately built from `rotate` and `scale` on one element. Real-time SVG
 * fluid — filters, feTurbulence, gooey blur stacks — costs a full-screen
 * repaint every frame to say the same thing.
 */
export function LiquidCursor({
  size = 28,
  stretch = 0.35,
  maxSpeed = 2400,
  color = "var(--color-blush-300)",
  filled = true,
  zIndex = 9997,
  disabled = false,
}: LiquidCursorProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(active);

  const x = useSpring(pointer.x, springs.responsive);
  const y = useSpring(pointer.y, springs.responsive);
  const left = useTransform(x, (value) => value - size / 2);
  const top = useTransform(y, (value) => value - size / 2);

  const amount = useTransform(pointer.speed, [0, maxSpeed], [0, clamp01(stretch)], {
    clamp: true,
  });
  const along = useSpring(
    useTransform(amount, (value) => 1 + value),
    springs.elastic,
  );
  // Volume is roughly preserved: what it gains lengthways it loses across.
  const across = useSpring(
    useTransform(amount, (value) => 1 - value * 0.7),
    springs.elastic,
  );
  const rotate = useSpring(pointer.angle, springs.responsive);
  const opacity = useSpring(pointer.presence, springs.soft);

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
        borderRadius: "50%",
        pointerEvents: "none",
        background: filled ? color : "transparent",
        border: filled ? "none" : `1.5px solid ${color}`,
        x: left,
        y: top,
        rotate,
        scaleX: along,
        scaleY: across,
        opacity,
      }}
    />
  );
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
