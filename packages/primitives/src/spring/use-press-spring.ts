"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useMemo } from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

export type PressSpringOptions = {
  /** Scale at full press. */
  scale?: number;
  preset?: SpringPreset;
  disabled?: boolean;
};

/**
 * Press feedback that answers the keyboard as well as the pointer.
 *
 * Returns handlers to spread onto any interactive element. `onKeyDown`/`onKeyUp`
 * are included deliberately: a button activated with Space should compress the
 * same way it does under a finger, or keyboard users get a silently different
 * component.
 */
export function usePressSpring({
  scale = 0.96,
  preset = "snappy",
  disabled = false,
}: PressSpringOptions = {}) {
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const pressed = useMotionValue(0);
  const springed = useSpring(pressed, springs[preset]);
  const pressScale = useTransform(springed, (value) => 1 - value * (1 - scale));

  const press = useCallback(() => active && pressed.set(1), [active, pressed]);
  const release = useCallback(() => active && pressed.set(0), [active, pressed]);

  const handlers = useMemo(
    () => ({
      onPointerDown: press,
      onPointerUp: release,
      onPointerLeave: release,
      onPointerCancel: release,
      onKeyDown: (event: { key: string }) => {
        if (event.key === " " || event.key === "Enter") press();
      },
      onKeyUp: (event: { key: string }) => {
        if (event.key === " " || event.key === "Enter") release();
      },
      onBlur: release,
    }),
    [press, release],
  );

  return { scale: active ? pressScale : undefined, pressed: springed, handlers, active };
}
