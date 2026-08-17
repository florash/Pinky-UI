"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "./internal";

export type LayeredButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  /** How far the rear planes travel on hover, in px. */
  separation?: number;
};

/**
 * Construction: three planes of the same footprint, stacked with a 1px offset,
 * the rear two progressively lighter.
 *
 * Motion signature — **separate, then recombine**. This is the deliberate
 * inverse of the extruded button: hover pulls the planes *apart* rather than
 * lifting one body, and press collapses all three back into a single surface.
 *
 * The separation is not decoration — it previews the action. This button is for
 * things that open something layered: a menu, a panel, a sheet. The stack
 * fanning out on approach and snapping shut on press is a small promise about
 * what the click will do.
 */
export const LayeredButton = forwardRef<HTMLButtonElement, LayeredButtonProps>(
  function LayeredButton(
    { children, separation = 3, className, disabled, type = "button", ...props },
    ref,
  ) {
    const engagement = useEngagement("soft");
    const press = usePressSpring({ scale: 1, disabled });

    // Rear planes fan out on hover and are pulled flush by press.
    const spread = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      Math.max(0, (hover ?? 0) - (pressed ?? 0)),
    );
    const secondY = useTransform(spread, (value) => 1 + value * separation);
    const thirdY = useTransform(spread, (value) => 2 + value * separation * 1.9);
    const faceY = useTransform(press.pressed, (value) => value * 2);

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn("group relative inline-flex rounded-[14px]", FOCUS_RING, DISABLED, className)}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {/* Rear plane — furthest back, lightest. */}
        <motion.span
          aria-hidden
          style={{ y: thirdY }}
          className="absolute inset-x-1.5 inset-y-0 rounded-[14px] border border-[color:var(--color-line)] bg-cloud-50"
        />
        {/* Middle plane. */}
        <motion.span
          aria-hidden
          style={{ y: secondY }}
          className="absolute inset-x-0.5 inset-y-0 rounded-[14px] border border-[color:var(--color-line)] bg-[color-mix(in_oklab,white_70%,var(--color-cloud-50))]"
        />
        {/* Face. */}
        <motion.span
          style={{ y: faceY }}
          className="relative inline-flex h-11 items-center justify-center rounded-[14px] border border-[color:var(--color-line)] bg-white px-6 text-sm font-medium text-ink-900 [box-shadow:var(--depth-raised-sm),var(--edge-light)]"
        >
          {children}
        </motion.span>
      </motion.button>
    );
  },
);
