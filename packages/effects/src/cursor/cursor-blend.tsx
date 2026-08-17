"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect } from "react";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useCursorTarget } from "./cursor-provider";

export type CursorBlendProps = {
  /** Diameter of the resting circle, in px. */
  size?: number;
  /** Diameter while over a Cursor Target or interactive element. */
  hoverSize?: number;
  response?: "soft" | "responsive" | "snappy";
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A solid circle composited with `mix-blend-mode: difference`, so it inverts
 * against whatever colour is beneath it — dark on light backgrounds, light on
 * dark ones, always readable, with no theme-aware colour of its own to get
 * wrong.
 *
 * `background: white` is deliberate, not a placeholder: `difference` against
 * white always inverts fully, which is what gives the effect its crisp,
 * even contrast at every position on the page. A themed fill would invert to
 * a different, uncontrolled colour at every crossing.
 *
 * Renders nothing on the server, nothing on touch devices, and nothing under
 * reduced motion — the native cursor is always the fallback.
 */
export function CursorBlend({ size = 24, hoverSize = 56, response = "snappy", zIndex = 9999, disabled = false }: CursorBlendProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;

  const pointer = usePointerSource(active);
  const target = useCursorTarget();
  const presence = useSpring(pointer.presence, springs.soft);

  const spring = springs[response];
  const diameter = useSpring(size, spring);
  const x = useTransform([pointer.x, diameter], ([value, current]: number[]) => (value ?? 0) - (current ?? size) / 2);
  const y = useTransform([pointer.y, diameter], ([value, current]: number[]) => (value ?? 0) - (current ?? size) / 2);

  useEffect(() => {
    diameter.set(target ? hoverSize : size);
  }, [diameter, hoverSize, size, target]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex,
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        pointerEvents: "none",
        background: "white",
        mixBlendMode: "difference",
        x,
        y,
        opacity: presence,
      }}
    />
  );
}
