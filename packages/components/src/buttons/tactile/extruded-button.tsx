"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "./internal";

export type ExtrudedButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  /** Visible thickness in px. Small is the point — 3 reads premium, 8 reads toy. */
  thickness?: number;
  tone?: "primary" | "soft";
};

/**
 * Construction: two stacked bodies. A top face, and a base of the same
 * footprint offset downward in a darker tint, so the gap between them *is* the
 * material thickness.
 *
 * Motion signature — **collapse**. This is the only button in the family with a
 * second body, so it is the only one whose press can remove height rather than
 * merely move the surface: the top face travels the full thickness down to meet
 * its base and the object visibly becomes thinner. Hover lifts the whole
 * assembly while the base stays put, which reads as the thickness increasing.
 *
 * Depth here is structural, not a shadow: remove every shadow from this
 * component and the thickness is still visible.
 */
export const ExtrudedButton = forwardRef<HTMLButtonElement, ExtrudedButtonProps>(
  function ExtrudedButton(
    { children, thickness = 3, tone = "primary", className, disabled, type = "button", ...props },
    ref,
  ) {
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });

    // The top face falls the whole thickness; the base never moves.
    const faceY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * -2 + (pressed ?? 0) * thickness,
    );
    const assemblyY = useTransform(engagement.value, (hover) => hover * -2);

    const primary = tone === "primary";

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y: assemblyY, paddingBottom: thickness }}
        className={cn("group relative inline-flex rounded-pill", FOCUS_RING, DISABLED, className)}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {/* The base. Static — the whole illusion depends on it not moving. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-pill",
            primary
              ? "bg-[color-mix(in_oklab,var(--color-ink-900)_62%,var(--color-cloud-300))]"
              : "bg-[color-mix(in_oklab,var(--color-cloud-300)_70%,var(--color-ink-900)_8%)]",
          )}
        />
        <motion.span
          style={{ y: faceY }}
          className={cn(
            "relative inline-flex h-11 items-center justify-center rounded-pill px-6 text-sm font-medium",
            "transition-[box-shadow] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
            primary
              ? "bg-ink-900 text-milk [box-shadow:var(--edge-light)]"
              : "bg-white text-ink-900 [box-shadow:var(--edge-light)]",
          )}
        >
          {children}
        </motion.span>
      </motion.button>
    );
  },
);
