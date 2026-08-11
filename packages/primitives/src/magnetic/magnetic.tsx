"use client";

import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { subscribeToPointer } from "../internal/pointer-store";
import { useElementRect } from "../internal/use-element-rect";
import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

export type MagneticProps = {
  children: ReactNode;
  /** How much of the pointer offset is followed, before clamping. */
  strength?: number;
  /** Distance in px beyond the element's own box where attraction begins. */
  range?: number;
  /** Hard cap on travel. Pinky's motion rules keep hover translation small. */
  maxOffset?: number;
  preset?: SpringPreset;
  className?: string;
  /** Turns the effect off without unmounting, e.g. while a menu is open. */
  disabled?: boolean;
};

/**
 * Pulls its child toward the pointer as the pointer approaches.
 *
 * The wrapper never changes size, so surrounding layout cannot shift; only a
 * transform is animated, which stays on the compositor.
 */
export function Magnetic({
  children,
  strength = 0.35,
  range = 110,
  maxOffset = 8,
  preset = "snappy",
  className,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useElementRect(ref);
  const motionEnabled = useMotionEnabled();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springs[preset]);
  const y = useSpring(rawY, springs[preset]);

  const active = motionEnabled && !disabled;

  useEffect(() => {
    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    return subscribeToPointer((pointer) => {
      const box = rect.current;
      if (!box || pointer.coarse || !pointer.active) {
        rawX.set(0);
        rawY.set(0);
        return;
      }

      const dx = pointer.x - box.centerX;
      const dy = pointer.y - box.centerY;
      const reach = Math.max(box.width, box.height) / 2 + range;
      const distance = Math.hypot(dx, dy);

      if (distance > reach) {
        rawX.set(0);
        rawY.set(0);
        return;
      }

      // Smoothstep falloff: full pull at the centre, and a soft release at the
      // edge of the field rather than a visible snap back to zero.
      const t = 1 - distance / reach;
      const falloff = t * t * (3 - 2 * t);

      rawX.set(clamp(dx * strength * falloff, maxOffset));
      rawY.set(clamp(dy * strength * falloff, maxOffset));
    });
  }, [active, maxOffset, range, rawX, rawY, rect, strength]);

  return (
    <motion.div ref={ref} className={className ?? "inline-flex"} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

function clamp(value: number, limit: number) {
  return Math.min(Math.max(value, -limit), limit);
}

export type { MotionValue };
