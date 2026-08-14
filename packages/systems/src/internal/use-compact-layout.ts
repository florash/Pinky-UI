"use client";

import { useEffect, useState } from "react";

/** Shared responsive state for systems whose mobile composition is structurally different. */
export function useCompactLayout() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  return compact;
}
