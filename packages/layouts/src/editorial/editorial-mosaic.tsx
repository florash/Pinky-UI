"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";

export type EditorialMosaicItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
  featured?: boolean;
  span?: 1 | 2;
  rows?: 1 | 2;
  className?: string;
};

export type EditorialMosaicProps = {
  items: EditorialMosaicItem[];
  columns?: 2 | 3 | 4;
  gap?: number;
  preset?: "quiet" | "responsive" | "editorial";
  label?: string;
  className?: string;
  disabled?: boolean;
  onActiveChange?: (id: string | null) => void;
};

/** A deterministic composition grid for mixed media, text and whitespace. */
export function EditorialMosaic({
  items,
  columns = 3,
  gap = 14,
  preset = "editorial",
  label = "Editorial mosaic",
  className,
  disabled = false,
  onActiveChange,
}: EditorialMosaicProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [active, setActive] = useState<string | null>(null);
  const enabled = motionEnabled && !disabled;
  const columnCount = compact ? Math.min(columns, 2) : columns;
  const setFocused = (id: string | null) => {
    setActive(id);
    onActiveChange?.(id);
  };
  const values = presetValues[preset];

  return (
    <ul
      aria-label={label}
      className={cn("grid list-none p-0", className)}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap }}
    >
      {items.map((item, index) => {
        const isActive = active === item.id;
        const isNeighbour = active !== null && !isActive && Math.abs(index - items.findIndex((entry) => entry.id === active)) <= 1;
        const span = item.span ?? (item.featured ? 2 : 1);
        const rows = item.rows ?? (item.featured ? 2 : 1);

        return (
          <motion.li
            key={item.id}
            className={cn("relative min-h-28 overflow-hidden rounded-2xl", item.className)}
            style={{ gridColumn: `span ${Math.min(span, columnCount)}`, gridRow: `span ${rows}`, zIndex: isActive ? 2 : 1 }}
            animate={
              enabled
                ? { scale: isActive ? values.scale : isNeighbour ? values.neighbourScale : 1, y: isActive ? values.y : 0 }
                : { scale: 1, y: 0 }
            }
            transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
            onPointerEnter={(event: PointerEvent<HTMLLIElement>) => {
              if (event.pointerType !== "touch" && event.pointerType !== "pen") setFocused(item.id);
            }}
            onPointerLeave={() => setFocused(null)}
            onFocusCapture={() => setFocused(item.id)}
            onBlurCapture={(event) => {
              if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(null);
            }}
          >
            {item.content}
            {item.meta ? (
              <span
                className="pointer-events-none absolute inset-x-3 bottom-3 truncate rounded-pill bg-ink-900/80 px-3 py-1.5 text-[clamp(0.6rem,1.3vw,0.75rem)] whitespace-nowrap text-milk transition-opacity duration-300"
                style={{ opacity: isActive || !enabled ? 1 : 0.78 }}
              >
                <span className="font-medium">{item.label}</span>
                <span className="ml-2 hidden text-milk/70 sm:inline">{item.meta}</span>
              </span>
            ) : null}
          </motion.li>
        );
      })}
    </ul>
  );
}

const presetValues = {
  quiet: { scale: 1.015, neighbourScale: 0.995, y: -3 },
  responsive: { scale: 1.025, neighbourScale: 0.985, y: -6 },
  editorial: { scale: 1.03, neighbourScale: 0.98, y: -8 },
} as const;
