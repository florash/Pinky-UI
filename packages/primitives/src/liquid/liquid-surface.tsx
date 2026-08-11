"use client";

import type { CSSProperties, ReactNode } from "react";

import { usePointerGlow } from "../glow/use-pointer-glow";

export type LiquidTint = "clear" | "cloud" | "blush";

export type LiquidSurfaceProps = {
  children?: ReactNode;
  /** Strength of the specular highlight and edge refraction, 0–1. */
  intensity?: number;
  /** Backdrop blur in px. 0 turns the backdrop filter off entirely. */
  blur?: number;
  tint?: LiquidTint;
  /** How far the light travels ahead of the pointer — the sense of thickness. */
  depth?: number;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
};

const TINT: Record<LiquidTint, { fill: string; edge: string }> = {
  clear: { fill: "rgba(255,255,255,0.55)", edge: "rgba(255,255,255,0.9)" },
  cloud: { fill: "color-mix(in oklab, var(--color-cloud-50) 70%, white)", edge: "var(--color-cloud-200)" },
  blush: { fill: "color-mix(in oklab, var(--color-blush-50) 70%, white)", edge: "var(--color-blush-200)" },
};

/**
 * A translucent surface that catches light where the pointer is.
 *
 * Three cheap layers stand in for refraction — a specular highlight, a bright
 * edge that shifts with the pointer, and a soft inner shadow for thickness.
 * No SVG filters and no per-frame JavaScript: the pointer writes two CSS
 * variables and the compositor paints the rest.
 *
 * Glass is a hierarchy tool, not a texture. One or two of these on a screen
 * reads as premium; a page of them reads as a phone wallpaper.
 */
export function LiquidSurface({
  children,
  intensity = 0.2,
  blur = 18,
  tint = "clear",
  depth = 0.12,
  className,
  style,
  disabled = false,
}: LiquidSurfaceProps) {
  const ref = usePointerGlow<HTMLDivElement>({ range: 40, disabled });
  const strength = Math.min(Math.max(intensity, 0), 1);
  const colors = TINT[tint];

  return (
    <div
      ref={ref}
      className={className}
      style={
        {
          position: "relative",
          isolation: "isolate",
          background: colors.fill,
          backdropFilter: blur > 0 ? `blur(${blur}px) saturate(1.4)` : undefined,
          WebkitBackdropFilter: blur > 0 ? `blur(${blur}px) saturate(1.4)` : undefined,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(255,255,255,0.35)`,
          ...style,
        } as CSSProperties
      }
    >
      {/* Specular highlight — the light on top of the surface. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: -1,
          opacity: `calc(var(--pinky-glow-opacity, 0) * ${0.35 + strength * 0.65})`,
          transition: "opacity 400ms var(--ease-soft)",
          background: `radial-gradient(${180 + depth * 700}px circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), rgba(255,255,255,0.95), transparent 62%)`,
        }}
      />

      {/* Edge refraction — brightest on the side the light comes from. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: -1,
          padding: 1,
          opacity: `calc(0.5 + var(--pinky-glow-opacity, 0) * ${strength})`,
          background: `radial-gradient(${260 + depth * 500}px circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), ${colors.edge}, rgba(255,255,255,0.35) 60%, rgba(120,140,170,0.14))`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          transition: "opacity 400ms var(--ease-soft)",
        }}
      />

      {children}
    </div>
  );
}
