"use client";

import { useEffect, useState } from "react";

export type PointerCapability = {
  /** True once a hover-capable pointer (mouse, most styluses) is confirmed. */
  hasHover: boolean;
  /** True once a fine-precision pointer is confirmed. */
  isFine: boolean;
  /** The practical touch signal: neither hover nor fine-pointer capable. */
  isTouch: boolean;
};

const REST: PointerCapability = { hasHover: false, isFine: false, isTouch: true };

/**
 * The one legitimate way to gate a hover-only effect: `(hover: hover)` and
 * `(pointer: fine)`, read together and kept live via `matchMedia` change
 * listeners.
 *
 * Deliberately not `'ontouchstart' in window` (true on hybrid laptops that
 * have both a touchscreen and a mouse) and not a screen-width breakpoint
 * (says nothing about input at all — a narrow desktop window is still a
 * mouse). A two-in-one device switching between keyboard-and-mouse and
 * tablet mode flips this live, mid-session.
 *
 * Starts touch/no-hover on the server and on first client render, so a
 * hover-only affordance never flashes in before hydration has confirmed a
 * pointer that can actually reach it.
 */
export function usePointerCapability(): PointerCapability {
  const [capability, setCapability] = useState<PointerCapability>(REST);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    const fineQuery = window.matchMedia("(pointer: fine)");

    const sync = () => {
      const hasHover = hoverQuery.matches;
      const isFine = fineQuery.matches;
      setCapability({ hasHover, isFine, isTouch: !hasHover && !isFine });
    };

    sync();
    hoverQuery.addEventListener("change", sync);
    fineQuery.addEventListener("change", sync);
    return () => {
      hoverQuery.removeEventListener("change", sync);
      fineQuery.removeEventListener("change", sync);
    };
  }, []);

  return capability;
}
