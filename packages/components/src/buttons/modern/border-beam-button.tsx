"use client";

import { useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "../tactile/internal";

export type BorderBeamButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  /** Seconds for one full lap. Slower reads more expensive. */
  duration?: number;
};

/**
 * Construction: a white pill inside a conic-gradient ring. The gradient is a
 * single blush→cloud arc against transparency, so only a short segment of the
 * border is ever lit — the rest of the ring is the ordinary hairline.
 *
 * Motion signature — **a lap of light**. Nothing on the button moves. The lit
 * arc rotates once around the perimeter on hover and stops when you leave,
 * which is the current idiom for "this is the primary action" without resorting
 * to a filled colour or a glow.
 *
 * It idles completely: no rotation runs until the pointer arrives, so a page of
 * these costs nothing at rest. Under reduced motion the arc simply sits at full
 * strength instead of travelling — the emphasis survives, the movement does not.
 */
export const BorderBeamButton = forwardRef<HTMLButtonElement, BorderBeamButtonProps>(
  function BorderBeamButton(
    { children, duration = 2.6, className, disabled, type = "button", ...props },
    ref,
  ) {
    const engagement = useEngagement();
    const motionEnabled = useMotionEnabled();
    const press = usePressSpring({ scale: 1, disabled });
    const y = useTransform(press.pressed, (v) => v * 2);
    const beamOpacity = useTransform(engagement.value, [0, 1], [0, 1]);

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y }}
        className={cn(
          "group relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-pill p-px",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {/* Resting hairline. */}
        <span aria-hidden className="absolute inset-0 rounded-pill bg-[color:var(--color-line-strong)]" />
        {/* The travelling arc. Square so the conic sweep stays circular. */}
        <motion.span
          aria-hidden
          className="absolute top-1/2 left-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: beamOpacity,
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, var(--color-blush-300) 340deg, var(--color-cloud-300) 356deg, transparent 360deg)",
          }}
          animate={motionEnabled ? { rotate: 360 } : { rotate: 0 }}
          transition={
            motionEnabled
              ? { duration, ease: "linear", repeat: Infinity }
              : { duration: 0 }
          }
        />
        <span className="relative z-10 inline-flex h-full w-full items-center justify-center rounded-pill bg-white px-6 text-sm font-medium text-ink-900">
          {children}
        </span>
      </motion.button>
    );
  },
);
