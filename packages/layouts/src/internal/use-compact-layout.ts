"use client";

import { useEffect, useState } from "react";

/**
 * Purely a layout signal — narrow viewport, less room for a wide grid or a
 * spatial arrangement. This says nothing about input: a narrow desktop
 * window with a mouse is still a mouse. Pair with `usePointerCapability()`
 * (`@pinky-ui/primitives`) separately wherever the decision is actually
 * about hover capability, e.g. whether to run pointer-driven spatial motion
 * at all — the two used to be OR'd together here, which meant a narrow
 * mouse-driven window was silently treated as touch.
 */
export function useCompactLayout() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return compact;
}
