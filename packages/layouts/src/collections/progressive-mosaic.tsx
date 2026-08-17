"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { mod, useControllable } from "../internal/use-controllable";
import { useCompactLayout } from "../internal/use-compact-layout";

export type ProgressiveMosaicItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
  span?: 1 | 2;
};

export type ProgressiveMosaicProps = {
  items: ProgressiveMosaicItem[];
  columns?: 2 | 3 | 4;
  gap?: number;
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** Re-prioritises a collection through stable grid layout, without becoming an expandable card. */
export function ProgressiveMosaic({
  items,
  columns = 3,
  gap = 12,
  activeId,
  defaultActiveId,
  onActiveIdChange,
  label = "Progressive mosaic",
  className,
  disabled = false,
}: ProgressiveMosaicProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [currentId, setCurrentId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const [focused, setFocused] = useState<string | null>(null);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === currentId));
  const columnCount = compact ? 2 : columns;
  if (!items.length) return null;
  const choose = (id: string) => setCurrentId(id);

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : mod(index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1), items.length);
    choose(items[next]?.id ?? items[0]?.id ?? "");
  };

  return (
    <ul aria-label={label} className={cn("grid list-none p-0", className)} style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gridAutoRows: compact ? "minmax(8rem, auto)" : "minmax(7.5rem, auto)", gridAutoFlow: "dense", gap }}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const isFocused = item.id === focused;
        const span = isActive ? columnCount > 1 ? 2 : 1 : Math.min(item.span ?? 1, columnCount);
        const rowSpan = isActive && !compact ? 2 : 1;
        return (
          <motion.li
            layout={motionEnabled}
            key={item.id}
            className="relative min-h-28 min-w-0 overflow-hidden rounded-2xl"
            style={{ gridColumn: `span ${span}`, gridRow: `span ${rowSpan}`, zIndex: isActive ? 2 : 1 }}
            animate={motionEnabled ? { y: isActive ? -4 : 0, opacity: isActive || isFocused ? 1 : 0.88 } : { y: 0, opacity: 1 }}
            transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
            onPointerEnter={(event: PointerEvent<HTMLLIElement>) => {
              if (event.pointerType !== "touch" && event.pointerType !== "pen") {
                setFocused(item.id);
                choose(item.id);
              }
            }}
            onPointerLeave={() => setFocused(null)}
            onFocusCapture={() => setFocused(item.id)}
            onBlurCapture={(event) => {
              if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(null);
            }}
          >
            <div className="relative block h-full min-h-28 w-full overflow-hidden rounded-2xl text-left">
              {item.content}
              <button
                type="button"
                aria-pressed={isActive}
                aria-label={`Focus ${item.label}`}
                className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-pill bg-white/82 px-3 py-1.5 text-left text-[0.6875rem] text-ink-900 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30"
                onClick={() => choose(item.id)}
                onKeyDown={(event) => keyDown(event, index)}
              >
                <span className="truncate font-medium">{item.label}</span>
                {item.meta ? <span className="hidden shrink-0 text-ink-500 sm:inline">{item.meta}</span> : null}
              </button>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
