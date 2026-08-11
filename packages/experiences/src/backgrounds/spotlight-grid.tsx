"use client";

import { CursorSpotlight } from "@pinky/effects";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type SpotlightGridProps = {
  children?: ReactNode;
  size?: number;
  lineColor?: string;
  tint?: string;
  radius?: number;
  intensity?: number;
  className?: string;
  disabled?: boolean;
};

/** A quiet local grid whose contrast lifts around the shared cursor spotlight. */
export function SpotlightGrid({
  children,
  size = 32,
  lineColor = "rgba(70,90,115,.08)",
  tint = "var(--color-cloud-100)",
  radius = 360,
  intensity = 0.28,
  className,
  disabled = false,
}: SpotlightGridProps) {
  const grid = `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
  return (
    <CursorSpotlight
      radius={radius}
      intensity={intensity}
      tint={tint}
      overlay
      disabled={disabled}
      className={cn("overflow-hidden", className)}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: grid, backgroundSize: `${size}px ${size}px` }} />
      <div className="relative z-10">{children}</div>
    </CursorSpotlight>
  );
}
