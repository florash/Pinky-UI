"use client";

import { motionValue, type MotionValue } from "motion/react";
import { useEffect } from "react";
import { subscribeToPointer, usePointerCapability } from "@pinky-ui/primitives";

/**
 * One pointer source for the whole cursor family.
 *
 * `@pinky-ui/primitives` already collapses every `pointermove` in the app into a
 * single frame-batched listener. This module goes one step further and
 * collapses every *cursor effect* into a single set of motion values: a page
 * running Soft Cursor, Cursor Trail and Cursor Blob together pays for one
 * subscription and one derivative calculation, not three.
 *
 * Nothing here touches React state. Values flow pointer → motion value →
 * transform, so a moving pointer never renders a component.
 */
export type PointerSource = {
  /** Viewport coordinates of the pointer. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** 1 while a fine pointer is on the page, 0 otherwise — fade cursor layers with this. */
  presence: MotionValue<number>;
  /** Pixels per second, smoothed. Signed. */
  velocityX: MotionValue<number>;
  velocityY: MotionValue<number>;
  /** Magnitude of the velocity vector, in px/s. */
  speed: MotionValue<number>;
  /** Direction of travel in degrees; holds its last value while stationary. */
  angle: MotionValue<number>;
};

let source: PointerSource | null = null;
let consumers = 0;
let release: (() => void) | null = null;

/** Smoothing on the velocity estimate: raw frame deltas are far too jumpy. */
const VELOCITY_SMOOTHING = 0.25;
/** Below this the pointer counts as resting, and effects with a threshold idle. */
const REST_SPEED = 12;

function getSource(): PointerSource {
  source ??= {
    x: motionValue(0),
    y: motionValue(0),
    presence: motionValue(0),
    velocityX: motionValue(0),
    velocityY: motionValue(0),
    speed: motionValue(0),
    angle: motionValue(0),
  };
  return source;
}

function acquire(): () => void {
  consumers += 1;

  if (consumers === 1) {
    const values = getSource();
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let seeded = false;

    release = subscribeToPointer((pointer) => {
      if (pointer.coarse || !pointer.active) {
        values.presence.set(0);
        values.velocityX.set(0);
        values.velocityY.set(0);
        values.speed.set(0);
        seeded = false;
        return;
      }

      const now = performance.now();
      values.x.set(pointer.x);
      values.y.set(pointer.y);
      values.presence.set(1);

      if (!seeded) {
        seeded = true;
        lastX = pointer.x;
        lastY = pointer.y;
        lastTime = now;
        return;
      }

      // Guard the divide: two events can share a millisecond.
      const elapsed = Math.max(now - lastTime, 1) / 1000;
      const nextX = (pointer.x - lastX) / elapsed;
      const nextY = (pointer.y - lastY) / elapsed;

      const smoothX = lerp(values.velocityX.get(), nextX, VELOCITY_SMOOTHING);
      const smoothY = lerp(values.velocityY.get(), nextY, VELOCITY_SMOOTHING);
      values.velocityX.set(smoothX);
      values.velocityY.set(smoothY);

      const speed = Math.hypot(smoothX, smoothY);
      values.speed.set(speed);
      // Keep the last heading while resting; an angle derived from noise spins.
      if (speed > REST_SPEED) {
        // Unwrapped, so a pointer crossing due west goes 179° → 181° rather
        // than 179° → -179°, which any spring would animate as a full spin.
        const previous = values.angle.get();
        const next = (Math.atan2(smoothY, smoothX) * 180) / Math.PI;
        values.angle.set(next + 360 * Math.round((previous - next) / 360));
      }

      lastX = pointer.x;
      lastY = pointer.y;
      lastTime = now;
    });
  }

  return () => {
    consumers -= 1;
    if (consumers === 0) {
      release?.();
      release = null;
      getSource().presence.set(0);
    }
  };
}

/**
 * Subscribes to the shared pointer source for as long as the component is
 * mounted and `enabled`. Returns the same motion values for every caller.
 */
export function usePointerSource(enabled = true): PointerSource {
  const values = getSource();

  useEffect(() => {
    if (!enabled) return;
    return acquire();
  }, [enabled]);

  return values;
}

/**
 * `true` only once a fine pointer has been confirmed on the client.
 *
 * Deliberately `false` on the server and on the first client render: cursor
 * layers then render nothing at all until the browser has told us a mouse
 * exists, which keeps hydration quiet and keeps decorative cursor DOM off
 * touch devices entirely rather than merely hidden.
 *
 * A thin re-export of `usePointerCapability().isFine` from `@pinky-ui/primitives`
 * — the cursor family's naming, the shared package's one media-query
 * subscription.
 */
export function useFinePointer(): boolean {
  return usePointerCapability().isFine;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export { REST_SPEED };
