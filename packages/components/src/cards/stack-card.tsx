"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type StackCardProps = {
  children: ReactNode;
  /** Number of decorative layers peeking out behind the face card, 1–3. */
  depth?: 1 | 2 | 3;
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

const RADIUS: Record<NonNullable<StackCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<StackCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/** Rest position and hover fan-out for each layer, precomputed rather than interpolated in JS — three layers is a small enough fixed set that a lookup table stays more legible than a formula. */
const LAYER: Record<1 | 2 | 3, string> = {
  1: "translate-y-1.5 scale-[0.99] motion-safe:group-hover:translate-y-2.5 motion-safe:group-hover:scale-[0.98]",
  2: "translate-y-3 scale-[0.97] motion-safe:group-hover:translate-y-5 motion-safe:group-hover:scale-[0.95]",
  3: "translate-y-4.5 scale-[0.95] motion-safe:group-hover:translate-y-7 motion-safe:group-hover:scale-[0.92]",
};

/**
 * A single card with 1–3 decorative layers peeking out from behind it,
 * fanning out slightly further on hover. This is a static illusion of
 * depth for one card — not `packages/systems`' `DraggableCardStack` or
 * `CardStackBrowse`, which are real browsing widgets holding many distinct
 * cards a user pages through. Reach for those when there's a stack of
 * *content* to get through; reach for this one when a single piece of
 * content just wants to look like it has some behind it. The layers are
 * `aria-hidden` — they carry no content of their own, so there's nothing
 * for assistive tech to announce.
 */
export function StackCard({
  children,
  depth = 2,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: StackCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;
  const layers = Array.from({ length: depth }, (_, index) => index + 1);

  return (
    <div className={cn("group relative w-full", className)}>
      {layers.map((layer) => (
        <span
          key={layer}
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-full border border-line bg-white/70",
            RADIUS[radius],
            "origin-top transition-transform duration-300 ease-[var(--ease-soft)]",
            LAYER[layer as 1 | 2 | 3],
          )}
          style={{ zIndex: -layer }}
        />
      ))}
      <Tag
        href={href}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
        className={cn(
          "relative block w-full overflow-hidden border border-line bg-white/90 text-left",
          RADIUS[radius],
          SHADOW[shadow].rest,
          "transition-transform duration-300 ease-[var(--ease-soft)] motion-safe:group-hover:-translate-y-1",
          clickable && cn(SHADOW[shadow].hover, CLICKABLE_FOCUS),
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>{children}</div>
      </Tag>
    </div>
  );
}
