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

vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
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

afterEach(() => {
  cleanup();
  setReducedMotion(false);
});
