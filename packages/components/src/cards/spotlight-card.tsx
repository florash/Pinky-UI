"use client";

import { Spotlight } from "@pinky/primitives";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type SpotlightCardProps = {
  children: ReactNode;
  /** Diameter of the light pool, in px. */
  size?: number;
  /** Peak brightness, 0–1. */
  intensity?: number;
  /** Light colour. Blush by default; cloud reads cooler. */
  color?: string;
  radius?: "lg" | "xl" | "2xl";
  padded?: boolean;
  className?: string;
  disabled?: boolean;
};

const RADIUS = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
} as const;

/**
 * A card lit under the pointer.
 *
 * The quiet member of the card family: nothing moves, nothing deforms, the
 * surface simply acknowledges where you are. That makes it the right choice in
 * grids where a dozen cards would otherwise all be leaning at once.
 */
export function SpotlightCard({
  children,
  size = 300,
  intensity = 0.5,
  color,
  radius = "xl",
  padded = true,
  className,
  disabled = false,
}: SpotlightCardProps) {
  return (
    <Spotlight
      size={size}
      intensity={intensity}
      color={color}
      disabled={disabled}
      className={cn(
        "h-full overflow-hidden bg-white/90 shadow-soft ring-1 ring-line",
        "transition-shadow duration-500 ease-[var(--ease-soft)] hover:shadow-lift",
        RADIUS[radius],
        className,
      )}
    >
      <div className={cn(padded && "p-6")}>{children}</div>
    </Spotlight>
  );
}
