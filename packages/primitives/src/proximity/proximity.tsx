"use client";

import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { subscribeToPointer } from "../internal/pointer-store";
import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

type Entry = { node: HTMLElement; value: MotionValue<number> };

type ProximityContextValue = {
  register: (entry: Entry) => () => void;
} | null;

const ProximityContext = createContext<ProximityContextValue>(null);

export type ProximityProps = {
  children: ReactNode;
  /** Distance in px over which proximity falls from 1 to 0. */
  distance?: number;
  /** Measure along one axis only — what a horizontal dock wants. */
  axis?: "x" | "y" | "both";
  disabled?: boolean;
};

/**
 * Shares one pointer subscription across every item inside it.
 *
 * The alternative — each item listening for itself — costs a listener, a rect
 * cache and a frame callback per item, which is how docks and menus become the
 * slowest thing on a page. Here a dock of ten icons costs the same as one, and
 * rects are re-measured only when layout can actually have changed.
 */
export function Proximity({
  children,
  distance = 120,
  axis = "x",
  disabled = false,
}: ProximityProps) {
  const entries = useRef(new Set<Entry>());
  const rects = useRef(new Map<Entry, { cx: number; cy: number }>());
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const context = useMemo<ProximityContextValue>(
    () => ({
      register(entry) {
        entries.current.add(entry);
        return () => {
          entries.current.delete(entry);
          rects.current.delete(entry);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const measure = () => {
      rects.current.clear();
      for (const entry of entries.current) {
        const box = entry.node.getBoundingClientRect();
        rects.current.set(entry, {
          cx: box.left + box.width / 2,
          cy: box.top + box.height / 2,
        });
      }
    };

    if (!active) {
      for (const entry of entries.current) entry.value.set(0);
      return;
    }

    measure();

    let frame = 0;
    const scheduleMeasure = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("scroll", scheduleMeasure, { passive: true, capture: true });

    const unsubscribe = subscribeToPointer((pointer) => {
      if (pointer.coarse || !pointer.active) {
        for (const entry of entries.current) entry.value.set(0);
        return;
      }

      // Measure lazily: items can mount after the provider's first pass.
      if (rects.current.size !== entries.current.size) measure();

      for (const entry of entries.current) {
        const rect = rects.current.get(entry);
        if (!rect) continue;

        const dx = axis === "y" ? 0 : pointer.x - rect.cx;
        const dy = axis === "x" ? 0 : pointer.y - rect.cy;
        const delta = Math.hypot(dx, dy);
        entry.value.set(delta >= distance ? 0 : 1 - delta / distance);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active, axis, distance]);

  return <ProximityContext.Provider value={context}>{children}</ProximityContext.Provider>;
}

/**
 * Gives one item its own 0–1 closeness value, springed.
 *
 * Returns 0 forever when used outside a {@link Proximity} provider or when
 * motion is reduced, so callers never need to branch.
 */
export function useProximityItem<T extends HTMLElement>(preset: SpringPreset = "responsive") {
  const context = useContext(ProximityContext);
  const ref = useRef<T>(null);
  const raw = useMotionValue(0);
  const proximity = useSpring(raw, springs[preset]);

  useEffect(() => {
    const node = ref.current;
    if (!context || !node) return;
    return context.register({ node, value: raw });
  }, [context, raw]);

  return { ref, proximity };
}
