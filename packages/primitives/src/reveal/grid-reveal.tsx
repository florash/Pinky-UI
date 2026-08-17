"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";

import { useReducedMotion } from "../internal/use-motion-enabled";

export type GridRevealProps = {
  open: boolean;
  children: ReactNode;
  /** `"rows"` for a height reveal (the common case — panels, accordions), `"columns"` for a width reveal (a label sliding out beside an icon). */
  axis?: "rows" | "columns";
  className?: string;
  /** Applied to the inner content wrapper — pass `id`/`role`/`aria-*` for the disclosure region here. */
  contentProps?: HTMLAttributes<HTMLDivElement>;
  /** Ref to the inner content wrapper — for a caller that needs to query or focus into the revealed content directly. */
  contentRef?: Ref<HTMLDivElement>;
  duration?: number;
  /**
   * Marks the collapsed content `inert` — off the tab order and assistive
   * tech — matching what an unmount used to do for free. Default `true`, the
   * right choice for real disclosure content (accordion detail, a hidden
   * panel). Set `false` for a purely visual clip whose text is meant to stay
   * discoverable even while collapsed — a button label that's always the
   * accessible name, never a second copy of it.
   */
  inertWhenClosed?: boolean;
};

/**
 * A disclosure's size, driven by CSS (`grid-template-rows`/`-columns: 0fr →
 * 1fr`) instead of a JS-measured `height`/`width: "auto"` animation. The
 * track's `fr` value transitions on the compositor path browsers already
 * optimize for grid, and — the actual point — it never has to *measure* the
 * content first, which an `"auto"` animation always does one way or another.
 *
 * Content stays mounted at all times, clipped to zero size by the grid track
 * rather than removed; `inert` takes it out of the tab order and off
 * assistive tech while collapsed, which is what an unmount used to buy for
 * free.
 *
 * `min-height`/`min-width: 0` on the inner wrapper is load-bearing, not
 * decoration — grid items refuse to shrink below their content's intrinsic
 * size without it, and the collapse silently stops working.
 */
export function GridReveal({ open, children, axis = "rows", className, contentProps, contentRef, duration = 300, inertWhenClosed = true }: GridRevealProps) {
  const reducedMotion = useReducedMotion();
  const { style: contentStyle, ...restContentProps } = contentProps ?? {};
  const track = open ? "1fr" : "0fr";

  return (
    <div
      className={className}
      style={{
        display: "grid",
        ...(axis === "rows" ? { gridTemplateRows: track } : { gridTemplateColumns: track }),
        transition: reducedMotion ? "none" : `grid-template-${axis} ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      <div
        {...restContentProps}
        ref={contentRef}
        inert={!open && inertWhenClosed ? true : undefined}
        style={{
          overflow: "hidden",
          ...(axis === "rows" ? { minHeight: 0 } : { minWidth: 0 }),
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
