"use client";

import { useEffect, useRef, type RefObject } from "react";

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

/**
 * Keeps a viewport-relative rect for `ref` in a mutable box.
 *
 * Measuring inside the pointer loop would force a layout read every frame for
 * every animated element. Instead we re-measure only when something can
 * actually change the box: resize, scroll, or a size change of the element.
 */
export function useElementRect(ref: RefObject<HTMLElement | null>) {
  const rect = useRef<Rect | null>(null);

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

    const scheduleMeasure = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(element);
    window.addEventListener("scroll", scheduleMeasure, { passive: true, capture: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleMeasure, { capture: true });
      window.removeEventListener("resize", scheduleMeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return rect;
}
