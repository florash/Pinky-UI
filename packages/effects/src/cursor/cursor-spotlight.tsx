"use client";

import { motion, useMotionTemplate, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useRect } from "../internal/use-rect";

export type CursorSpotlightProps = {
  children?: ReactNode;
  /** Radius of the light pool, in px. Sections want this large. */
  radius?: number;
  /** Peak opacity, 0–1. The default is deliberately faint. */
  intensity?: number;
  /** Any CSS colour. */
  tint?: string;
  /**
   * `container` lights only this section and fades at its edge.
   * `viewport` lights the whole page from a fixed layer.
   */
  mode?: "container" | "viewport";
  /** Distance outside the container where the light fades in, in px. */
  range?: number;
  /** Put the light above the content instead of behind it. */
  overlay?: boolean;
  className?: string;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A pointer-following light for a whole region.
 *
 * Spotlight Card lights one surface as a hover affordance; this lights a
 * *section* as atmosphere. The distinction is what it means: card light says
 * "this is the thing you are pointing at", region light says "you are here".
 * Used at card scale it is a hover state; used at section scale it should be
 * barely perceptible — hence the low default intensity.
 *
 * The gradient is a CSS background driven by motion values, so the pointer
 * never renders React and the paint stays on one composited layer.
 */
export function CursorSpotlight({
  children,
  radius = 420,
  intensity = 0.35,
  tint = "var(--color-blush-300)",
  mode = "container",
  range = 80,
  overlay = false,
  className,
  zIndex,
  disabled = false,
}: CursorSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(active);

  const viewport = mode === "viewport";

  const localX = useTransform(pointer.x, (value) =>
    viewport ? value : value - (rect.current?.left ?? 0),
  );
  const localY = useTransform(pointer.y, (value) =>
    viewport ? value : value - (rect.current?.top ?? 0),
  );

  // Falloff outside the box, so the light arrives before the pointer does.
  const reach = Math.max(range, 1);
  const rawOpacity = useTransform(
    [pointer.x, pointer.y, pointer.presence],
    ([x, y, presence]: number[]) => {
      if (!presence) return 0;
      if (viewport) return intensity;
      const box = rect.current;
      if (!box) return 0;
      const outsideX = Math.max(Math.abs((x ?? 0) - box.centerX) - box.width / 2, 0);
      const outsideY = Math.max(Math.abs((y ?? 0) - box.centerY) - box.height / 2, 0);
      const distance = Math.hypot(outsideX, outsideY);
      return distance >= reach ? 0 : intensity * (1 - distance / reach);
    },
  );
  const opacity = useSpring(rawOpacity, springs.soft);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${localX}px ${localY}px, ${tint}, transparent 70%)`;

  const light = active ? (
    <motion.span
      aria-hidden
      style={{
        position: viewport ? "fixed" : "absolute",
        inset: 0,
        zIndex: zIndex ?? (overlay ? 1 : -1),
        borderRadius: "inherit",
        pointerEvents: "none",
        background,
        opacity,
      }}
    />
  ) : null;

  if (viewport) {
    return (
      <>
        {light}
        {children}
      </>
    );
  }

  return (
    <div ref={ref} className={cn("relative isolate", className)}>
      {light}
      {children}
    </div>
  );
}
