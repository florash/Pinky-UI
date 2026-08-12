"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders its children only once they are near the viewport.
 *
 * The showcase pages mount every demo on the same page, and several of them —
 * ambient backgrounds especially — run continuously from the moment they exist.
 * Four animated backgrounds and a page of reveal effects all starting at load is
 * a cost the visitor pays before they have scrolled to any of it.
 *
 * A reserved-height placeholder stands in until then, so nothing shifts when the
 * real demo arrives. Where there is no IntersectionObserver, children render
 * immediately: this is an optimisation, never a gate on the content.
 */
export function LazyMount({
  children,
  minHeight = 288,
  rootMargin = "300px 0px",
  className,
  label = "Demo loads as it comes into view",
}: {
  children: ReactNode;
  /** Reserved height for the placeholder, matching the demo it stands in for. */
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShown(true);
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shown]);

  if (shown) return <>{children}</>;

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight }}
      role="status"
      aria-label={label}
    />
  );
}
