"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky/primitives";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useCursorTarget } from "./cursor-provider";

export type CursorTextProps = {
  /** Shown when no target is claiming the cursor. Usually nothing. */
  fallback?: string;
  /** Follower diameter in px. Big enough for a word, small enough to see past. */
  size?: number;
  background?: string;
  color?: string;
  /** Offset from the pointer, in px. Keeps the label off the thing it names. */
  offset?: number;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A cursor follower that says what the thing under it does.
 *
 * The label belongs to the region, not to this component: regions declare
 * themselves with {@link CursorTarget}, and this only renders whatever is
 * currently claimed. That is what makes it composable — a project grid, a
 * gallery and a drag surface can each mean something different without this
 * component knowing any of them exist.
 *
 * Purely decorative: `aria-hidden` and `pointer-events: none`. The label must
 * repeat something already available to a screen reader — a link's text, a
 * button's name — never introduce information.
 */
export function CursorText({
  fallback,
  size = 76,
  background = "var(--color-ink-900)",
  color = "var(--color-milk)",
  offset = 0,
  zIndex = 9998,
  disabled = false,
}: CursorTextProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;

  const pointer = usePointerSource(active);
  const target = useCursorTarget();
  const label = target?.label ?? fallback;

  const x = useSpring(pointer.x, springs.responsive);
  const y = useSpring(pointer.y, springs.responsive);
  const left = useTransform(x, (value) => value - size / 2 + offset);
  const top = useTransform(y, (value) => value - size / 2 + offset);

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
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        background,
        color,
        x: left,
        y: top,
      }}
      initial={false}
      animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
      transition={{ type: "spring", ...springs.snappy }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label ?? "__empty"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          style={{
            display: "block",
            padding: "0 10px",
            fontSize: 12,
            lineHeight: 1.2,
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
