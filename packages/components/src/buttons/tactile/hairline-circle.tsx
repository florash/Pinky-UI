"use client";

import { surfaceShadow, usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { CONTROL_PX, DISABLED, FOCUS_RING, useEngagement, type ControlSize } from "./internal";

export type HairlineCircleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  /** The glyph. Kept thin and geometric; the button supplies the breathing room. */
  icon: ReactNode;
  /** Required: an icon-only control has no accessible name without it. */
  "aria-label": string;
  size?: ControlSize;
};

/**
 * Construction: a single white disc inside a 1px ring, almost flat at rest.
 *
 * Motion signature — **rise and return**. There is no second body and no
 * layering; the whole control is one surface, so the only thing it can do is
 * leave the plane and come back. Hover lifts it 2px and the ring gains
 * contrast; press carries it 1px below its resting position and swaps the
 * outer shadow for an inner one, so the disc reads as sitting *in* the page
 * rather than on it.
 *
 * The glyph travels slightly less than the surface. That small lag is what
 * makes it read as an object with a face rather than a flat sticker.
 */
export const HairlineCircle = forwardRef<HTMLButtonElement, HairlineCircleProps>(
  function HairlineCircle({ icon, size = "md", className, disabled, type = "button", ...props }, ref) {
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });

    const y = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * -2 + (pressed ?? 0) * 3,
    );
    const glyphY = useTransform(y, (value) => value * 0.35);
    const px = CONTROL_PX[size];

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y, width: px, height: px }}
        className={cn(
          "group relative inline-grid place-items-center rounded-full border bg-white text-ink-900",
          "border-[color:var(--color-line)] hover:border-[color:var(--color-line-strong)]",
          "[box-shadow:var(--depth-flat)] hover:[box-shadow:var(--depth-raised-sm),var(--edge-light)]",
          "focus-visible:border-[color:var(--color-line-strong)]",
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
        <motion.span aria-hidden style={{ y: glyphY }} className="grid place-items-center">
          {icon}
        </motion.span>
      </motion.button>
    );
  },
);

/** Exported so the reference wall can show the resting material without a pointer. */
export const hairlineRestShadow = surfaceShadow("flat");
