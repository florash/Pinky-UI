"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type GradientBorderCardProps = {
  children: ReactNode;
  /** Border thickness in px. */
  thickness?: number;
  /** Two gradient stops. Defaults to the family's own pink/blue accent pair, not a new hue. */
  from?: string;
  to?: string;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<GradientBorderCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * A static two-stop gradient ring, painted once and never animated — the
 * plain, always-on sibling to Glow Border's pointer-tracked light and
 * Border Beam Card's travelling one. Reach for this one when the card
 * needs to read as "special" at rest, in a screenshot, in a list a pointer
 * never touches — the other two only earn their keep once something's
 * actually moving over or around the card.
 */
export function GradientBorderCard({
  children,
  thickness = 1.5,
  from = "var(--color-blush-300)",
  to = "var(--color-cloud-300)",
  radius = "xl",
  padded = true,
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: GradientBorderCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  const maskStyle: CSSProperties = {
    padding: thickness,
    background: `linear-gradient(135deg, ${from}, ${to})`,
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
  };

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative isolate block w-full overflow-hidden bg-white/90 text-left shadow-soft",
        RADIUS[radius],
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)] hover:shadow-lift", CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-10", RADIUS[radius])} style={maskStyle} />
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>{children}</div>
    </Tag>
  );
}
