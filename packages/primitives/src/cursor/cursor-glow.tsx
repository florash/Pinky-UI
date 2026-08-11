"use client";

import type { CSSProperties, ReactNode } from "react";

import { usePointerGlow } from "../glow/use-pointer-glow";

export type CursorGlowProps = {
  children?: ReactNode;
  /** Diameter of the light pool, in px. */
  size?: number;
  /** Any CSS colour. Defaults to Pinky's blush tint. */
  color?: string;
  /** Peak opacity of the light. */
  intensity?: number;
  className?: string;
  disabled?: boolean;
};

/**
 * Ambient light that follows the pointer across a region.
 *
 * The glow sits in a `pointer-events: none` layer beneath the content, so it
 * cannot intercept clicks or affect layout.
 */
export function CursorGlow({
  children,
  size = 420,
  color = "var(--color-blush-300)",
  intensity = 0.55,
  className,
  disabled = false,
}: CursorGlowProps) {
  const ref = usePointerGlow<HTMLDivElement>({ range: 16, disabled });

  return (
    <div
      ref={ref}
      className={`pinky-cursor-glow relative isolate ${className ?? ""}`}
      style={{ "--pinky-glow-size": `${size}px` } as CSSProperties}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          opacity: `calc(var(--pinky-glow-opacity, 0) * ${intensity})`,
          background: `radial-gradient(var(--pinky-glow-size) circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), ${color}, transparent 70%)`,
          transition: "opacity 320ms ease",
        }}
      />
      {children}
    </div>
  );
}
