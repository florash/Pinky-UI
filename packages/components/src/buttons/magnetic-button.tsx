"use client";

import { Magnetic } from "@pinky/primitives";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../utils/cn";

export type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "soft" | "ghost";
  size?: "sm" | "md" | "lg";
  /** How strongly the button follows a nearby pointer. */
  strength?: number;
  /** Proximity field around the button, in px. */
  range?: number;
  /** Maximum travel, in px. Kept small on purpose. */
  maxOffset?: number;
  /**
   * Layout classes for the magnetic wrapper — display, visibility, grid or flex
   * placement. `className` styles the button itself, which is one element in.
   */
  wrapperClassName?: string;
};

const VARIANTS = {
  primary:
    "bg-ink-900 text-milk shadow-soft hover:shadow-lift active:brightness-110 border border-transparent",
  soft: "bg-white text-ink-900 border border-line shadow-soft hover:shadow-lift hover:border-line-strong",
  ghost: "bg-transparent text-ink-700 border border-transparent hover:bg-white/70 hover:text-ink-900",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
} as const;

/**
 * The button's visual surface, exposed so links can wear the same skin without
 * pretending to be buttons.
 */
export function buttonSurface(
  variant: NonNullable<MagneticButtonProps["variant"]> = "primary",
  size: NonNullable<MagneticButtonProps["size"]> = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap",
    "transition-[box-shadow,background-color,color,border-color] duration-300 ease-[var(--ease-soft)]",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

/**
 * A button that leans toward the pointer as it approaches.
 *
 * The magnetism lives on a wrapper, so the button itself stays an ordinary
 * `<button>`: keyboard, focus and click behaviour are untouched, and the effect
 * simply never engages for touch or reduced-motion users.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      children,
      variant = "primary",
      size = "md",
      strength = 0.4,
      range = 110,
      maxOffset = 8,
      className,
      wrapperClassName,
      type = "button",
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <Magnetic
        strength={strength}
        range={range}
        maxOffset={maxOffset}
        disabled={disabled}
        className={wrapperClassName ?? "inline-flex"}
      >
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          className={buttonSurface(variant, size, className)}
          {...props}
        >
          {/* The label drifts a little further than the surface it sits on.
              That small parallax is the difference between a button that
              responds and a button that is simply dragged by the cursor. */}
          <Magnetic
            strength={strength * 0.4}
            range={range}
            maxOffset={Math.min(maxOffset * 0.4, 4)}
            preset="soft"
            disabled={disabled}
            className="inline-flex items-center gap-2"
          >
            {children}
          </Magnetic>
        </button>
      </Magnetic>
    );
  },
);
