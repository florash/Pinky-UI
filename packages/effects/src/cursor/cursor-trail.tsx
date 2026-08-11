"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef } from "react";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";

export type CursorTrailMode = "dots" | "bubbles" | "soft";

export type CursorTrailProps = {
  /** Hard cap on trail elements. They are recycled, never created per move. */
  count?: number;
  /** Diameter of a trail element, in px. */
  size?: number;
  color?: string;
  mode?: CursorTrailMode;
  /** How long one mark takes to disappear, in ms. Short is the point. */
  lifetime?: number;
  /** Pointer travel between marks, in px. Lower means a denser trail. */
  spacing?: number;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A short trail of soft marks behind the pointer.
 *
 * Built as a fixed-size pool of recycled nodes: `count` elements are created
 * once, and moving the pointer repositions them and restarts a Web Animation.
 * Nothing is appended to the DOM per frame, nothing is garbage per frame, and
 * there is no animation loop when the pointer is still — the browser owns the
 * fades and stops on its own.
 *
 * Off on touch and under reduced motion, where a trail is either meaningless or
 * actively unpleasant.
 */
export function CursorTrail({
  count = 14,
  size = 10,
  color = "var(--color-blush-300)",
  mode = "dots",
  lifetime = 620,
  spacing = 18,
  zIndex = 9996,
  disabled = false,
}: CursorTrailProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(active);

  const layer = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLSpanElement[]>([]);
  const poolSize = Math.max(Math.floor(count), 0);

  useEffect(() => {
    const root = layer.current;
    if (!active || !root) return;

    const pool = nodes.current.slice(0, poolSize);
    if (pool.length === 0) return;
    const animations: Animation[] = new Array(pool.length);
    let cursor = 0;
    let lastX = pointer.x.get();
    let lastY = pointer.y.get();
    let seeded = false;

    const spawn = () => {
      const x = pointer.x.get();
      const y = pointer.y.get();

      if (!seeded) {
        seeded = true;
        lastX = x;
        lastY = y;
        return;
      }

      if (Math.hypot(x - lastX, y - lastY) < spacing) return;
      lastX = x;
      lastY = y;

      const index = cursor;
      cursor = (cursor + 1) % pool.length;
      const node = pool[index];
      if (!node) return;

      animations[index]?.cancel();

      const from = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(1)`;
      const to = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${
        mode === "bubbles" ? 1.6 : 0.3
      })`;

      // jsdom and very old browsers have no WAAPI; the trail is decorative, so
      // its absence is a non-event rather than something to polyfill.
      if (typeof node.animate !== "function") return;

      animations[index] = node.animate(
        [
          { transform: from, opacity: mode === "soft" ? 0.5 : 0.75 },
          { transform: to, opacity: 0 },
        ],
        { duration: lifetime, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };

    const stopX = pointer.x.on("change", spawn);
    const stopY = pointer.y.on("change", spawn);

    return () => {
      stopX();
      stopY();
      for (const animation of animations) animation?.cancel();
    };
  }, [active, count, lifetime, mode, pointer.x, pointer.y, poolSize, size, spacing]);

  if (!active) return null;

  return (
    <div
      ref={layer}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex, pointerEvents: "none" }}
    >
      {Array.from({ length: poolSize }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            if (node) nodes.current[index] = node;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: "50%",
            opacity: 0,
            willChange: "transform, opacity",
            ...surface(mode, color),
          }}
        />
      ))}
    </div>
  );
}

function surface(mode: CursorTrailMode, color: string) {
  if (mode === "bubbles") return { border: `1px solid ${color}`, background: "transparent" };
  if (mode === "soft") {
    return { background: `radial-gradient(circle, ${color} 0%, transparent 70%)` };
  }
  return { background: color };
}
