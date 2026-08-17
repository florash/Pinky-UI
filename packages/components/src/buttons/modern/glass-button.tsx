"use client";

import { LiquidSurface, usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "../tactile/internal";

export type GlassButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  /** Backdrop blur in px. 0 makes it opaque and costs nothing. */
  blur?: number;
  icon?: ReactNode;
};

/**
 * Construction: a translucent surface over whatever is behind it, with a
 * refracting edge and a pointer-tracked specular highlight — built on the
 * existing `LiquidSurface` primitive rather than a stack of hand-rolled
 * gradients.
 *
 * Motion signature — **light before matter**. The surface itself barely moves;
 * what responds is the light travelling across it and gathering at the leading
 * edge. Press compresses the highlight rather than the shape.
 *
 * The one honest caveat is cost: `backdrop-filter` is the most expensive thing
 * in this library, so `blur={0}` is a real option and a grid of these is not.
 */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { children, blur = 14, icon, className, disabled, type = "button", ...props },
  ref,
) {
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled });
  const y = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) * -1.5 + (pressed ?? 0) * 2,
  );

  return (
    <LiquidSurface
      intensity={0.34}
      blur={blur}
      tint="blush"
      depth={0.18}
      disabled={disabled}
      className="inline-flex rounded-pill"
    >
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y }}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-pill px-6 text-sm font-medium text-ink-900",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {icon ? <span aria-hidden>{icon}</span> : null}
        {children}
      </motion.button>
    </LiquidSurface>
  );
});
