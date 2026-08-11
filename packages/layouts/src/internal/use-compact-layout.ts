"use client";

import { useEffect, useState } from "react";

/** Touch and narrow layouts should use native flow rather than desktop spatial choreography. */
export function useCompactLayout() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => setCompact(query.matches || window.innerWidth <= 767);
    sync();
    query.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return compact;
}
