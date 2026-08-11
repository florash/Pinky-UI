"use client";

import { motionValue, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, type RefObject } from "react";

/** Values shared by scroll-linked effects. No scroll event updates React. */
export type ScrollSource = {
  y: MotionValue<number>;
  viewportHeight: MotionValue<number>;
  documentHeight: MotionValue<number>;
};

let source: ScrollSource | null = null;
let consumers = 0;
let release: (() => void) | null = null;
let frame = 0;

function getSource(): ScrollSource {
  source ??= {
    y: motionValue(0),
    viewportHeight: motionValue(0),
    documentHeight: motionValue(0),
  };
  return source;
}

function read(values: ScrollSource) {
  if (typeof window === "undefined") return;

  const documentElement = document.documentElement;
  const body = document.body;
  values.y.set(window.scrollY || window.pageYOffset || 0);
  values.viewportHeight.set(window.innerHeight || 0);
  values.documentHeight.set(
    Math.max(documentElement?.scrollHeight ?? 0, body?.scrollHeight ?? 0, window.innerHeight || 0),
  );
}

function schedule() {
  if (frame || typeof window === "undefined") return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    if (source) read(source);
  });
}

function acquire() {
  consumers += 1;
  if (consumers !== 1 || typeof window === "undefined") return;

  const values = getSource();
  read(values);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });

  release = () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

function drop() {
  consumers = Math.max(consumers - 1, 0);
  if (consumers === 0) {
    release?.();
    release = null;
  }
}

/** Returns the shared page scroll values for as long as `enabled` is true. */
export function useScrollSource(enabled = true): ScrollSource {
  const values = getSource();

  useEffect(() => {
    if (!enabled) return;
    acquire();
    return drop;
  }, [enabled]);

  return values;
}

/** A small, dependency-free clamp useful to scroll progress components. */
export function clampProgress(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

/** Progress through a scrollable element, including its viewport. */
export function calculateScrollProgress(scrollTop: number, scrollHeight: number, clientHeight: number) {
  const travel = Math.max(scrollHeight - clientHeight, 0);
  if (travel === 0) return 0;
  return clampProgress(scrollTop / travel);
}

/** Progress while an element travels through the viewport. */
export function calculateViewportProgress(top: number, height: number, viewportHeight: number) {
  const travel = Math.max(height - viewportHeight, 1);
  return clampProgress(-top / travel);
}

/**
 * A local progress value for a section. The source is shared; only the final
 * MotionValue write belongs to this section, and it never causes a React
 * render.
 */
export function useViewportProgress(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
): MotionValue<number> {
  const source = useScrollSource(enabled);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!enabled) {
      progress.set(0);
      return;
    }

    const update = () => {
      const element = ref.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      progress.set(calculateViewportProgress(box.top, box.height, source.viewportHeight.get()));
    };

    update();
    const stopY = source.y.on("change", update);
    const stopHeight = source.viewportHeight.on("change", update);
    return () => {
      stopY();
      stopHeight();
    };
  }, [enabled, progress, ref, source.viewportHeight, source.y]);

  return progress;
}
