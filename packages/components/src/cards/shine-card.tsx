"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type ShineCardProps = {
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

const RADIUS: Record<NonNullable<ShineCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<ShineCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * A diagonal gloss streak sweeps across the surface on hover — purely
 * decorative, an `aria-hidden` layer sitting above the content and below
 * nothing else, so it never competes for a click or a screen reader's
 * attention. The sweep is `motion-safe:` only; under reduced motion (and on
 * any device that never hovers) the card is identical to Basic Card, which
 * is exactly the point — this is a finish, not content.
 */
export function ShineCard({
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
}: ShineCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "group relative isolate block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 -left-1/3 z-10 w-1/3 -skew-x-12",
          "bg-gradient-to-r from-transparent via-white/50 to-transparent",
          "-translate-x-full opacity-0",
          "motion-safe:group-hover:translate-x-[400%] motion-safe:group-hover:opacity-100",
          "transition-[transform,opacity] duration-700 ease-[var(--ease-soft)]",
        )}
      />
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>{children}</div>
    </Tag>
  );
}
