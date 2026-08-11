"use client";

import { useEffect, useState } from "react";

/**
 * `false` on the server and on the first client render, so markup matches and
 * hydration stays quiet; `false` forever when the user asks for reduced motion.
 *
 * Components must render a complete, usable UI while this is `false` — motion
 * is the enhancement, never the content.
 */
export function useMotionEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return enabled;
}
