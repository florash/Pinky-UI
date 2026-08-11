"use client";

import { Parallax, ParallaxLayer, Tilt } from "@pinky/primitives";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type TiltCardProps = {
  children: ReactNode;
  /** Content that floats above the card face — a badge, a title, an image. */
  foreground?: ReactNode;
  /** Maximum rotation per axis, in degrees. Pinky keeps this at or under 4. */
  max?: number;
  /** Specular highlight that follows the pointer. */
  glare?: boolean;
  /** How far the foreground layer separates from the face. */
  parallax?: number;
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
 * A rigid card that turns to face the pointer.
 *
 * Where Jelly Card is soft, this one is solid — it catches light rather than
 * deforming. The default 4° is small on purpose: past roughly 8° a card stops
 * reading as a surface in space and starts reading as an effect.
 */
export function TiltCard({
  children,
  foreground,
  max = 4,
  glare = true,
  parallax = 0.6,
  radius = "xl",
  padded = true,
  className,
  disabled = false,
}: TiltCardProps) {
  return (
    <Tilt max={max} glare={glare} lift={8} disabled={disabled} className={cn(RADIUS[radius], className)}>
      <Parallax
        disabled={disabled}
        className={cn(
          "relative h-full overflow-hidden bg-white shadow-soft ring-1 ring-line",
          RADIUS[radius],
          padded && "p-6",
        )}
      >
        {children}
        {foreground ? (
          <ParallaxLayer depth={parallax} className="pointer-events-none absolute inset-0">
            {foreground}
          </ParallaxLayer>
        ) : null}
      </Parallax>
    </Tilt>
  );
}
