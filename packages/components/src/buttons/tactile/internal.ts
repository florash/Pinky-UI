"use client";

import { springs, useMotionEnabled, type SpringPreset } from "@pinky/primitives";
import { useMotionValue, useSpring } from "motion/react";
import { useMemo, type PointerEvent as ReactPointerEvent } from "react";

export type ControlSize = "xs" | "sm" | "md" | "lg";

/** One size scale for the whole collection. No per-component dimensions. */
export const CONTROL_PX: Record<ControlSize, number> = { xs: 32, sm: 40, md: 48, lg: 56 };

/**
 * Focus is part of the construction, not a default outline bolted on afterwards.
 *
 * `outline` rather than `box-shadow` on purpose: every button in this family
 * carries depth in its box-shadow, and a focus ring that fought the depth for
 * the same property would either be clipped by it or overwrite it. An outline
 * sits outside the box entirely, so a focused button keeps its full material.
 *
 * Focus also triggers the same engagement lift as hover, so keyboard users get
 * the dimensional response and not just a rectangle.
 */
export const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-ink-900)]";

/** Shared disabled treatment: flattened, never merely faded. */
export const DISABLED = "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none";

/**
 * A 0→1 "engagement" signal for hover and keyboard focus.
 *
 * Each button transforms this into its own geometry — a lift, a layer
 * separation, a ring displacement, a width — so the collection shares timing
 * without sharing a motion signature.
 *
 * Under reduced motion the spring is bypassed rather than the signal being
 * suppressed: engagement still reaches 1, instantly. A raised button is still
 * raised, it simply does not travel there. That distinction is the whole point
 * of depth as opposed to animation.
 */
export function useEngagement(preset: SpringPreset = "snappy") {
  const motionEnabled = useMotionEnabled();
  const raw = useMotionValue(0);
  const springed = useSpring(raw, springs[preset]);
  const value = motionEnabled ? springed : raw;

  const handlers = useMemo(
    () => ({
      onPointerEnter: (event: ReactPointerEvent) => {
        // Touch already produces a press; a hover lift on tap would double up.
        if (event.pointerType !== "touch") raw.set(1);
      },
      onPointerLeave: () => raw.set(0),
      onFocus: () => raw.set(1),
      onBlur: () => raw.set(0),
    }),
    [raw],
  );

  return { value, handlers, motionEnabled };
}
