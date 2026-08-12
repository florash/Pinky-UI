"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "./internal";

export type Direction = "forward" | "back" | "up" | "down";

export type DirectionalButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  direction?: Direction;
  glyph?: ReactNode;
};

const VECTOR: Record<Direction, { x: number; y: number; leading: boolean }> = {
  forward: { x: 1, y: 0, leading: false },
  back: { x: -1, y: 0, leading: true },
  up: { x: 0, y: -1, leading: false },
  down: { x: 0, y: 1, leading: false },
};

const DEFAULT_GLYPH: Record<Direction, string> = { forward: "→", back: "←", up: "↑", down: "↓" };

/**
 * Construction: a quiet pill with the arrow on its own layer.
 *
 * Motion signature — **semantic travel**. Alone in this family, the movement
 * carries meaning rather than announcing interactivity: `Next →` pushes its
 * arrow right, `← Back` pulls left, `↑ Upload` lifts. The surface barely
 * changes; the arrow does the talking, and it always talks in the direction the
 * action will actually take you.
 *
 * Press returns the arrow to centre — the gesture is spent — while the surface
 * compresses. Because direction is the entire idea, the arrow leads or trails
 * the label to match, rather than being pinned to one side.
 */
export const DirectionalButton = forwardRef<HTMLButtonElement, DirectionalButtonProps>(
  function DirectionalButton(
    { children, direction = "forward", glyph, className, disabled, type = "button", ...props },
    ref,
  ) {
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });
    const vector = VECTOR[direction];

    // Engagement pushes the arrow along its vector; press retracts it to centre.
    const travel = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      Math.max(0, (hover ?? 0) - (pressed ?? 0) * 1.4),
    );
    const glyphX = useTransform(travel, (value) => value * vector.x * 4);
    const glyphY = useTransform(travel, (value) => value * vector.y * 4);
    const surfaceY = useTransform(press.pressed, (value) => value * 1.5);

    const arrow = (
      <motion.span aria-hidden style={{ x: glyphX, y: glyphY }} className="inline-block leading-none">
        {glyph ?? DEFAULT_GLYPH[direction]}
      </motion.span>
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y: surfaceY }}
        className={cn(
          "inline-flex h-11 items-center gap-2.5 rounded-pill border border-[color:var(--color-line)] bg-white px-5 text-sm font-medium text-ink-900",
          "hover:border-[color:var(--color-line-strong)] focus-visible:border-[color:var(--color-line-strong)]",
          "[box-shadow:var(--depth-raised-sm)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
          "active:[box-shadow:var(--depth-pressed)]",
          "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {vector.leading ? arrow : null}
        {children}
        {vector.leading ? null : arrow}
      </motion.button>
    );
  },
);
