"use client";

import { distribute, useColumns, type ResponsiveColumns } from "@pinky/primitives";
import { Children, type ReactNode } from "react";

export type MasonryGalleryProps = {
  children: ReactNode;
  columns?: ResponsiveColumns | number;
  /** Gap in px. */
  gap?: number;
  label?: string;
  className?: string;
};

/**
 * A column layout for content of mixed heights.
 *
 * Items are distributed round-robin rather than height-balanced. Balancing
 * needs every item measured, which means the gallery reflows once images load
 * — the exact layout jump this component exists to avoid. Round robin is
 * correct from the first paint and stays in DOM order.
 *
 * The layout itself has no motion: whatever you put in the columns brings its
 * own. That keeps it usable with a hundred items, where per-item pointer
 * effects would not be.
 */
export function MasonryGallery({
  children,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  gap = 16,
  label,
  className,
}: MasonryGalleryProps) {
  const count = useColumns(columns);
  const items = Children.toArray(children);
  const buckets = distribute(items, count);

  return (
    <ul
      aria-label={label}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        gap,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {buckets.map((bucket, column) => (
        <li key={column} style={{ display: "flex", flexDirection: "column", gap }}>
          {bucket}
        </li>
      ))}
    </ul>
  );
}
