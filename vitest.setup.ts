import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * jsdom has no `matchMedia`, and every Pinky primitive asks it whether motion
 * is allowed. The default answer here is "motion is fine"; the reduced-motion
 * tests override it per case with {@link setReducedMotion}.
 */
let reducedMotion = false;

export function setReducedMotion(value: boolean) {
  reducedMotion = value;
}

/**
 * The default answer for `(hover: hover)` and `(pointer: fine)` is "no" —
 * the same conservative, touch-first default `usePointerCapability` and
 * `useFinePointer` ship with for a real browser before the first paint.
 * Tests for the hover-capable path opt in per case with
 * {@link setPointerCapability}.
 */
let hoverCapable = false;

export function setPointerCapability(value: boolean) {
  hoverCapable = value;
}

vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: query.includes("prefers-reduced-motion")
      ? reducedMotion
      : query.includes("hover: hover") || query.includes("pointer: fine")
        ? hoverCapable
        : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);

// Used by useElementRect; jsdom does not implement it.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

// Motion may restore scroll position while a modal surface mounts; jsdom does
// not implement the browser method, so keep the test signal quiet.
vi.stubGlobal("scrollTo", vi.fn());

afterEach(() => {
  cleanup();
  setReducedMotion(false);
  setPointerCapability(false);
});
