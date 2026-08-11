"use client";

import { useEffect, useState } from "react";

export type ResponsiveColumns = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

const TABLET = 640;
const DESKTOP = 1024;

/**
 * Resolves a responsive column count.
 *
 * Starts at the mobile value on the server and on first paint, then upgrades
 * once the client can measure — so the markup matches during hydration and a
 * narrow viewport never renders a desktop layout it has to undo.
 */
export function useColumns(columns: ResponsiveColumns | number = 3): number {
  const config: Required<ResponsiveColumns> =
    typeof columns === "number"
      ? { mobile: columns, tablet: columns, desktop: columns }
      : { mobile: columns.mobile ?? 1, tablet: columns.tablet ?? 2, desktop: columns.desktop ?? 3 };

  const [count, setCount] = useState(config.mobile);

  useEffect(() => {
    const tablet = window.matchMedia(`(min-width: ${TABLET}px)`);
    const desktop = window.matchMedia(`(min-width: ${DESKTOP}px)`);

    const sync = () => {
      setCount(desktop.matches ? config.desktop : tablet.matches ? config.tablet : config.mobile);
    };

    sync();
    tablet.addEventListener("change", sync);
    desktop.addEventListener("change", sync);

    return () => {
      tablet.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, [config.desktop, config.mobile, config.tablet]);

  return count;
}

/**
 * Splits items round-robin across columns.
 *
 * Deliberately not a height-balanced masonry: balancing requires measuring
 * every item, which means a reflow after images load and a visible jump. Round
 * robin is stable from the first paint, reads in DOM order, and is close enough
 * to balanced when aspect ratios are mixed.
 */
export function distribute<T>(items: T[], columns: number): T[][] {
  const buckets: T[][] = Array.from({ length: Math.max(columns, 1) }, () => []);
  items.forEach((item, index) => buckets[index % buckets.length]!.push(item));
  return buckets;
}
