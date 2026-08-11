"use client";

import { useEffect, useRef, type RefObject } from "react";

export type TrackedRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

/**
 * A viewport-relative rect for `ref`, kept in a ref box rather than state.
 *
 * The pointer loop must never call `getBoundingClientRect`: that forces layout
 * on every frame, for every effect on the page. We re-measure only when
 * something can actually have moved the box — resize, scroll, or a size change
 * of the element itself — and the loop reads a plain object.
 *
 * This mirrors the primitives' own `useElementRect`, which is package-internal
 * and not exported. Duplicating ~40 lines is cheaper than widening the
 * primitives' public surface while another milestone is editing it.
 */
export function useRect(ref: RefObject<HTMLElement | null>) {
  const rect = useRef<TrackedRect | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      rect.current = {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        centerX: box.left + box.width / 2,
        centerY: box.top + box.height / 2,
      };
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(element);
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return rect;
}
