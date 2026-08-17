"use client";

import { LiquidSurface, type LiquidTint } from "@pinky-ui/primitives";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../internal/cn";

export type GlassLayerProps = {
  children: ReactNode;
  /** Which edge this layer sits against — adds the matching safe-area padding. */
  edge?: "top" | "bottom" | "none";
  /** Backdrop blur in px. */
  blur?: number;
  tint?: LiquidTint;
  className?: string;
};

const SAFE_AREA: Record<"top" | "bottom", string> = {
  top: "max(0.75rem, env(safe-area-inset-top))",
  bottom: "max(0.75rem, env(safe-area-inset-bottom))",
};

/**
 * A translucent bar for a mobile nav, tab bar or floating header, built on
 * the `LiquidSurface` primitive rather than a second glass implementation.
 * Where `backdrop-filter` isn't supported the surface still reads correctly
 * — it falls back to its solid tint, never to transparent.
 */
export function GlassLayer({ children, edge = "none", blur = 20, tint = "clear", className }: GlassLayerProps) {
  const style: CSSProperties =
    edge === "top" ? { paddingTop: SAFE_AREA.top } : edge === "bottom" ? { paddingBottom: SAFE_AREA.bottom } : {};

  return (
    <LiquidSurface blur={blur} tint={tint} intensity={0.16} depth={0.1} className={cn("w-full", className)} style={style}>
      {children}
    </LiquidSurface>
  );
}
