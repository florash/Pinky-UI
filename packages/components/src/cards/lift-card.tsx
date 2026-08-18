"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type LiftCardProps = {
  children: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<LiftCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<LiftCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * The cheapest card in the family, on purpose: `transform` + `box-shadow`
 * only, both plain CSS, no pointer-event listeners, no motion values, no
 * `usePointerGlow`/`useMotionEnabled` subscription. Jelly Card gives every
 * card in a grid its own elastic personality; Lift Card exists for the grid
 * itself, where the honest cost of a dozen simultaneously-mounted pointer
 * trackers is the whole reason to reach for something plainer. Pick Jelly
 * Card when a handful of cards deserve individual character; pick this one
 * when there will be many and the effect only needs to read as "this is
 * liftable," not "this is alive." `translate-y` is skipped automatically
 * under `prefers-reduced-motion: reduce` by `transition-property` scoping —
 * a reduced-motion user still gets the shadow's depth cue, just without the
 * position change.
 */
export function LiftCard({
  children,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: LiftCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable &&
          cn(
            "transition-[transform,box-shadow] duration-300 ease-[var(--ease-soft)]",
            "motion-safe:hover:-translate-y-1",
            SHADOW[shadow].hover,
            CLICKABLE_FOCUS,
          ),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>{children}</div>
    </Tag>
  );
}
