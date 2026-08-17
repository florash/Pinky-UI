"use client";

import { LiquidSurface, type LiquidTint } from "@pinky-ui/primitives";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type LiquidCardProps = {
  children: ReactNode;
  /** Strength of the highlight and edge refraction, 0–1. */
  intensity?: number;
  /** Backdrop blur in px. 0 makes the card opaque and costs nothing. */
  blur?: number;
  tint?: LiquidTint;
  /** Sense of thickness — how far light travels through the surface. */
  depth?: number;
  radius?: "lg" | "xl" | "2xl";
  padded?: boolean;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
} as const;

/**
 * A translucent surface with pointer-aware light.
 *
 * Deliberately not glassmorphism-by-default: the blur is moderate, the tint is
 * a wash rather than a colour, and text sits on an opaque-enough backing to
 * stay readable over whatever is behind the card. Transparency is used to
 * create hierarchy, not texture.
 */
export function LiquidCard({
  children,
  intensity = 0.2,
  blur = 18,
  tint = "clear",
  depth = 0.12,
  radius = "2xl",
  padded = true,
  className,
  surfaceClassName,
  disabled = false,
}: LiquidCardProps) {
  return (
    <LiquidSurface
      intensity={intensity}
      blur={blur}
      tint={tint}
      depth={depth}
      disabled={disabled}
      className={cn("overflow-hidden", RADIUS[radius], className)}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className={cn(padded && "p-6 sm:p-7", "text-ink-900", surfaceClassName)}>{children}</div>
    </LiquidSurface>
  );
}
