"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useMemo } from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

export type PressSpringOptions = {
  /** Scale at full press. */
  scale?: number;
  /**
   * Downward travel at full press, in px.
   *
   * Defaults to 0, so every existing caller keeps exactly the behaviour it had
   * before depth existed. Dimensional buttons opt in.
   */
  travel?: number;
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
 *
 * `pressed` is the raw 0→1 springed signal. It is the shared press *engine*,
 * not a shared press *animation*: an extruded button transforms it into a
 * collapsing gap, a layered button into recombining planes, a ring button into
 * radial displacement. Deriving all of them from one signal keeps the timing
 * identical across the collection while the motion signatures stay distinct.
 */
export function usePressSpring({
  scale = 0.96,
  travel = 0,
  preset = "snappy",
  disabled = false,
}: PressSpringOptions = {}) {
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const pressed = useMotionValue(0);
  const springed = useSpring(pressed, springs[preset]);
  const pressScale = useTransform(springed, (value) => 1 - value * (1 - scale));
  const pressY = useTransform(springed, (value) => value * travel);

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

  return {
    scale: active ? pressScale : undefined,
    /** Downward travel in px. Undefined when motion is off, like `scale`. */
    y: active ? pressY : undefined,
    /**
     * The raw springed 0→1 press signal, always present.
     *
     * Unlike `scale` and `y` this is not gated on motion being enabled, so a
     * component can still read the press state under reduced motion and answer
     * it with a non-moving change — a deeper border, a different shadow — which
     * is what reduced motion should mean for a tactile control.
     */
    pressed: springed,
    handlers,
    active,
  };
}
