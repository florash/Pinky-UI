"use client";

import type { CSSProperties, ReactNode } from "react";

import { usePointerGlow } from "../glow/use-pointer-glow";

export type SpotlightProps = {
  children: ReactNode;
  /** Diameter of the light pool, in px. */
  size?: number;
  /** Peak brightness, 0–1. */
  intensity?: number;
  color?: string;
  /** Distance outside the element where the light fades in, in px. */
  range?: number;
  className?: string;
  disabled?: boolean;
};

/**
 * Lights the surface under the pointer.
 *
 * The sibling of Glow Border, and the distinction matters when choosing:
 * Glow Border lights the *edge* of a surface, Spotlight lights its *face*.
 * Edge light frames something; face light draws the eye to a region of it.
 */
export function Spotlight({
  children,
  size = 300,
  intensity = 0.5,
  color = "var(--color-blush-100)",
  range = 30,
  className,
  disabled = false,
}: SpotlightProps) {
  const ref = usePointerGlow<HTMLDivElement>({ range, disabled });

  return (
    <div ref={ref} className={className} style={{ position: "relative", isolation: "isolate" }}>
      <span
        aria-hidden
        style={
          {
            position: "absolute",
            inset: 0,
            zIndex: -1,
            borderRadius: "inherit",
            pointerEvents: "none",
            opacity: `calc(var(--pinky-glow-opacity, 0) * ${intensity})`,
            transition: "opacity 350ms var(--ease-soft)",
            background: `radial-gradient(${size}px circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), ${color}, transparent 68%)`,
          } as CSSProperties
        }
      />
      {children}
    </div>
  );
}
