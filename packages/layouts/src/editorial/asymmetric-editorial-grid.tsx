"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";

export type AsymmetricEditorialGridItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
  featured?: boolean;
  span?: 1 | 2;
  className?: string;
};

export type AsymmetricEditorialGridProps = {
  items: AsymmetricEditorialGridItem[];
  columns?: 2 | 3 | 4;
  gap?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
  onActiveChange?: (id: string | null) => void;
};

/** An authored editorial rhythm with hierarchy, not a uniformly sized masonry feed. */
export function AsymmetricEditorialGrid({
  items,
  columns = 3,
  gap = 16,
  label = "Asymmetric editorial grid",
  className,
  disabled = false,
  onActiveChange,
}: AsymmetricEditorialGridProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [active, setActive] = useState<string | null>(null);
  const columnCount = compact ? Math.min(columns, 2) : columns;

  const setFocused = (id: string | null) => {
    setActive(id);
    onActiveChange?.(id);
  };

  return (
    <ul
      aria-label={label}
      className={cn("grid list-none p-0", className)}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gridAutoRows: compact ? "minmax(8.5rem, auto)" : "minmax(7rem, auto)",
        gridAutoFlow: "dense",
        gap,
      }}
    >
      {items.map((item, index) => {
        const isActive = active === item.id;
        const isNeighbour = active !== null && !isActive && Math.abs(index - items.findIndex((entry) => entry.id === active)) <= 1;
        const featured = item.featured ?? index === 0;
        const span = compact ? (featured ? 2 : 1) : Math.min(item.span ?? (featured ? 2 : 1), columnCount);
        const rows = compact ? 1 : featured ? 2 : 1;

        return (
          <motion.li
            key={item.id}
            className={cn("relative min-h-28 overflow-hidden rounded-2xl", item.className)}
            style={{
              gridColumn: `span ${span}`,
              gridRow: `span ${rows}`,
              zIndex: isActive ? 2 : 1,
              alignSelf: index % 3 === 1 && !compact ? "center" : undefined,
            }}
            animate={motionEnabled ? { y: isActive ? -5 : 0, scale: isNeighbour ? 0.985 : 1 } : { y: 0, scale: 1 }}
            transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
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
            <button
              type="button"
              aria-pressed={isActive}
              className="absolute inset-x-3 bottom-3 truncate rounded-pill bg-ink-900/80 px-3 py-1.5 text-left text-[0.6875rem] whitespace-nowrap text-milk shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              onClick={() => setFocused(item.id)}
            >
              <span className="font-medium">{item.label}</span>
              {item.meta ? <span className="ml-2 text-milk/70">{item.meta}</span> : null}
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
