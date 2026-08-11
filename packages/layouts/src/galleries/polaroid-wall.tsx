"use client";

import { scatterAt, springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { Children, useState, type ReactNode } from "react";

export type PolaroidWallProps = {
  children: ReactNode;
  /** How far photos drift from their grid position. */
  spread?: "tight" | "soft" | "loose";
  /** Maximum resting rotation, in degrees. */
  rotation?: number;
  /** How far neighbours are nudged aside by the focused photo, 0–1. */
  overlap?: number;
  columns?: number;
  /** Change to reshuffle the arrangement. */
  seed?: number;
  className?: string;
  disabled?: boolean;
};

const SPREAD: Record<NonNullable<PolaroidWallProps["spread"]>, number> = {
  tight: 0.03,
  soft: 0.07,
  loose: 0.12,
};

/**
 * Photos pinned to a wall rather than aligned to a grid.
 *
 * Each photo sits at a deterministic angle and offset — hashed from its index,
 * so the wall is identical on the server and the client and never reshuffles on
 * re-render. Focusing one straightens and lifts it while its neighbours lean
 * away, which is what makes the wall feel like a physical surface rather than a
 * grid with rotation applied.
 *
 * Focus, not just hover: every photo is reachable by keyboard and responds the
 * same way.
 */
export function PolaroidWall({
  children,
  spread = "soft",
  rotation = 6,
  overlap = 0.12,
  columns = 3,
  seed = 0,
  className,
  disabled = false,
}: PolaroidWallProps) {
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;
  const [focused, setFocused] = useState<number | null>(null);
  const items = Children.toArray(children);

  return (
    <ul
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "clamp(0.75rem, 2vw, 1.75rem)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((child, index) => {
        const rest = scatterAt(index, {
          rotation,
          offset: SPREAD[spread],
          seed,
        });

        const isFocused = focused === index;
        // Neighbours lean away from the focused photo, further the closer they are.
        const distance = focused === null ? 0 : index - focused;
        const push =
          focused === null || isFocused || Math.abs(distance) > 2
            ? 0
            : Math.sign(distance) * overlap * 100 * (Math.abs(distance) === 1 ? 1 : 0.45);

        return (
          <motion.li
            key={index}
            className="relative"
            style={{ zIndex: isFocused ? 20 : 1 }}
            animate={
              active
                ? {
                    rotate: isFocused ? 0 : rest.rotate,
                    x: (isFocused ? 0 : rest.x) + push,
                    y: isFocused ? rest.y - 10 : rest.y,
                    scale: isFocused ? 1.04 : 1,
                  }
                : { rotate: 0, x: 0, y: 0, scale: 1 }
            }
            transition={active ? { type: "spring", ...springs.soft } : { duration: 0 }}
            onHoverStart={() => setFocused(index)}
            onHoverEnd={() => setFocused((current) => (current === index ? null : current))}
            onFocusCapture={() => setFocused(index)}
            onBlurCapture={() => setFocused((current) => (current === index ? null : current))}
          >
            {child}
          </motion.li>
        );
      })}
    </ul>
  );
}
