"use client";

import { usePointerGlow } from "@pinky/primitives";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../utils/cn";

export type GlowBorderProps = {
  children: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl" | "pill";
  /** Border thickness in px. */
  thickness?: number;
  /** Size of the travelling light pool, in px. */
  size?: number;
  /** Peak brightness, 0–1. */
  intensity?: number;
  /** The light itself. Two stops are blended along the pointer gradient. */
  from?: string;
  to?: string;
  /** Distance outside the element where the light starts to fade in, in px. */
  range?: number;
  /** Keeps the border lit regardless of pointer position — for selected states. */
  active?: boolean;
  className?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<GlowBorderProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  pill: "rounded-pill",
};

/**
 * A border that lights up where the pointer is.
 *
 * The lit edge is one element: a gradient box masked down to its own border
 * ring. Nothing animates in JavaScript — the pointer only updates two CSS
 * custom properties, and the compositor paints the rest.
 */
export function GlowBorder({
  children,
  radius = "xl",
  thickness = 1.5,
  size = 260,
  intensity = 1,
  from = "var(--color-blush-300)",
  to = "var(--color-cloud-300)",
  range = 80,
  active = false,
  className,
  disabled = false,
}: GlowBorderProps) {
  const ref = usePointerGlow<HTMLDivElement>({ range, disabled });

  const maskStyle: CSSProperties = {
    padding: thickness,
    background: `radial-gradient(${size}px circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), ${from}, ${to} 45%, transparent 72%)`,
    opacity: active ? intensity : `calc(var(--pinky-glow-opacity, 0) * ${intensity})`,
    // Show the padding ring only: paint the box, then punch out its content area.
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
    transition: "opacity 320ms var(--ease-soft)",
  };

  return (
    <div ref={ref} className={cn("relative isolate", RADIUS[radius], className)}>
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", RADIUS[radius])}
        style={maskStyle}
      />
      {children}
    </div>
  );
}
