"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type GlowCardProps = {
  children: ReactNode;
  /** Glow colour. Blush by default; pass a cloud token for a cooler read. */
  color?: string;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<GlowCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * An ambient bloom that sits behind the card and blooms wider on hover —
 * not pointer-tracked (that's Spotlight Card, lighting the surface itself,
 * and Glow Border, lighting the edge under the pointer specifically). This
 * one glows from its own center outward regardless of where the pointer
 * actually is, closer to a halo than a light source, and reads as one
 * shared identity across every card in a row rather than each one
 * independently reacting. Pure CSS opacity/blur, no pointer-event
 * listeners; the blur intensifying is `motion-safe:`, so reduced-motion
 * users still get *a* glow at rest, just not one that grows under hover.
 */
export function GlowCard({
  children,
  color = "var(--color-blush-300)",
  radius = "xl",
  padded = true,
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: GlowCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "group relative isolate block w-full text-left",
        clickable && CLICKABLE_FOCUS,
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-3 -z-10 rounded-[inherit] opacity-40 blur-2xl",
          "motion-safe:transition-[opacity,filter] motion-safe:duration-500 motion-safe:ease-[var(--ease-soft)]",
          "motion-safe:group-hover:opacity-70 motion-safe:group-hover:blur-3xl",
        )}
        style={{ background: color }}
      />
      <div
        className={cn(
          "relative overflow-hidden border border-line bg-white/90",
          RADIUS[radius],
          "shadow-soft",
          padded && "p-6 sm:p-7",
          surfaceClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
