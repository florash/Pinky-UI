"use client";

import { Jelly, usePointerGlow } from "@pinky/primitives";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../utils/cn";

export type JellyCardProps = {
  children: ReactNode;
  /** 0 = calm settle, 1 = visible wobble. */
  elasticity?: number;
  /** Magnitude of the lean toward the pointer. */
  intensity?: number;
  /** Scale while hovered. */
  hoverScale?: number;
  radius?: "md" | "lg" | "xl" | "2xl";
  /** Soft light that follows the pointer across the surface. */
  glow?: boolean;
  /** Pinky's atmospheric elevation, on by default. */
  elevated?: boolean;
  /** Applied to the outer element, so grid and flex placement work as expected. */
  className?: string;
  /** Applied to the inner surface, for padding, background or text overrides. */
  surfaceClassName?: string;
  /** Padding is on by default; turn it off for edge-to-edge media. */
  padded?: boolean;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<JellyCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

/**
 * A soft elastic surface that responds naturally to pointer movement.
 *
 * The card is a plain block in the layout — all deformation happens on a
 * transform, so nothing around it moves.
 */
export function JellyCard({
  children,
  elasticity = 0.35,
  intensity = 0.18,
  hoverScale = 1.02,
  radius = "xl",
  glow = true,
  elevated = true,
  className,
  surfaceClassName,
  padded = true,
  disabled = false,
}: JellyCardProps) {
  const glowRef = usePointerGlow<HTMLDivElement>({ range: 24, disabled: disabled || !glow });

  return (
    <Jelly
      elasticity={elasticity}
      intensity={intensity}
      hoverScale={hoverScale}
      className={cn("will-change-transform", RADIUS[radius], className)}
      disabled={disabled}
    >
      <div
        ref={glowRef}
        className={cn(
          "relative isolate h-full overflow-hidden",
          RADIUS[radius],
          "border border-line bg-white/90",
          elevated && "shadow-soft",
          padded && "p-6 sm:p-7",
          surfaceClassName,
        )}
        // Small enough to read as light falling on part of the card rather
        // than a tint washed over the whole surface.
        style={{ "--pinky-glow-size": "230px" } as CSSProperties}
      >
        {glow ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
            style={{
              opacity: "var(--pinky-glow-opacity, 0)",
              background:
                "radial-gradient(var(--pinky-glow-size) circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), var(--color-blush-100), transparent 70%)",
            }}
          />
        ) : null}
        {children}
      </div>
    </Jelly>
  );
}
