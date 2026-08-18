"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { mod, useControllable } from "../internal/use-controllable";
import { useCompactLayout } from "../internal/use-compact-layout";

export type LayeredCollectionItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
};

export type LayeredCollectionProps = {
  items: LayeredCollectionItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  overlap?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** Multi-surface collection: each plane stays legible while the selected one comes forward. */
export function LayeredCollection({
  items,
  activeId,
  defaultActiveId,
  onActiveIdChange,
  overlap = 22,
  label = "Layered collection",
  className,
  disabled = false,
}: LayeredCollectionProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [currentId, setCurrentId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const [focused, setFocused] = useState<string | null>(null);
  const selected = items.findIndex((item) => item.id === currentId);
  if (!items.length) return null;
  const choose = (id: string) => setCurrentId(id);

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : mod(index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1), items.length);
    choose(items[next]?.id ?? items[0]?.id ?? "");
  };

  return (
    <div aria-label={label} className={cn("overflow-hidden rounded-2xl bg-cloud-50 p-3 sm:p-5", className)}>
      <ul className={cn("m-0 grid list-none p-0", compact ? "gap-3" : "gap-0")} style={{ gridTemplateColumns: compact ? "1fr" : `repeat(${items.length}, minmax(8rem, 1fr))` }}>
        {items.map((item, index) => {
          const isActive = index === selected;
          const isFocused = item.id === focused;
          const translate = compact ? 0 : isActive ? -10 : index % 2 === 0 ? 8 : 0;
          return (
            <motion.li
              key={item.id}
              className="relative min-w-0"
              style={{ zIndex: isActive ? 10 : items.length - index, marginLeft: compact ? 0 : index > 0 ? -overlap : 0, marginTop: compact ? 0 : index % 2 === 1 ? 16 : 0 }}
              animate={motionEnabled ? { y: translate, scale: isActive || isFocused ? 1.015 : 1 } : { y: compact ? 0 : index % 2 === 1 ? 16 : 0, scale: 1 }}
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
              <div className="group block h-full min-h-48 w-full rounded-2xl border border-line bg-white p-4 text-left shadow-soft transition-[border-color,box-shadow] hover:border-line-strong">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Select ${item.label}`}
                  className="flex w-full items-center justify-between gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
                  onClick={() => choose(item.id)}
                  onKeyDown={(event) => keyDown(event, index)}
                >
                  <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span aria-hidden className={cn("size-2 rounded-full transition-colors", isActive ? "bg-blush-400" : "bg-cloud-200 group-hover:bg-blush-200")} />
                  </span>
                  <span className="truncate text-sm font-semibold">{item.label}</span>
                  <span aria-hidden className="font-mono text-[0.625rem] text-ink-400">{isActive ? "●" : "○"}</span>
                </button>
                {item.meta ? <span className="mt-1 block pl-7 text-xs text-ink-500">{item.meta}</span> : null}
                <div className="mt-4 overflow-hidden rounded-xl">{item.content}</div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
