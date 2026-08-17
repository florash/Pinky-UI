"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { mod, useControllable } from "../internal/use-controllable";
import { useCompactLayout } from "../internal/use-compact-layout";

export type FocusRailItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
};

export type FocusRailProps = {
  items: FocusRailItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** A continuous secondary rail that changes the primary surface, rather than a tab strip. */
export function FocusRail({
  items,
  activeId,
  defaultActiveId,
  onActiveIdChange,
  label = "Focus rail",
  className,
  disabled = false,
}: FocusRailProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [currentId, setCurrentId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const [focused, setFocused] = useState<string | null>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const selected = items.find((item) => item.id === currentId) ?? items[0];
  if (!selected) return null;

  const choose = (id: string) => setCurrentId(id);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const target = railRef.current?.querySelectorAll<HTMLButtonElement>("button")[event.key === "Home" ? 0 : items.length - 1];
      target?.focus();
      if (target) choose(target.dataset.itemId ?? items[0]?.id ?? "");
      return;
    }
    if (!delta || items.length < 2) return;
    event.preventDefault();
    const targetIndex = mod(index + delta, items.length);
    const target = railRef.current?.querySelectorAll<HTMLButtonElement>("button")[targetIndex];
    target?.focus();
    choose(items[targetIndex]?.id ?? "");
  };

  return (
    <div className={cn("grid gap-6", className)} style={{ gridTemplateColumns: compact ? "1fr" : "minmax(0, 1fr) 8.5rem" }}>
      <section aria-live="polite" aria-label={`${selected.label} preview`} className="relative min-h-56 overflow-hidden rounded-2xl bg-white/80 ring-1 ring-line">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.id}
            className="h-full p-5 sm:p-7"
            initial={motionEnabled ? { opacity: 0, x: 18 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={motionEnabled ? { opacity: 0, x: -18 } : undefined}
            transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
          >
            <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Primary surface</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{selected.label}</h3>
            {selected.meta ? <p className="mt-1 text-xs text-ink-500">{selected.meta}</p> : null}
            <div className="mt-5">{selected.content}</div>
          </motion.div>
        </AnimatePresence>
      </section>

      <ol ref={railRef} aria-label={label} className={cn("m-0 flex list-none gap-2 p-0", compact ? "overflow-x-auto pb-1" : "flex-col")}>
        {items.map((item, index) => {
          const isActive = item.id === selected.id;
          const isFocused = item.id === focused;
          return (
            <li key={item.id} className={cn("min-w-36", !compact && "min-w-0 flex-1")}>
              <button
                type="button"
                data-item-id={item.id}
                aria-current={isActive ? "true" : undefined}
                aria-pressed={isActive}
                className="group flex h-full w-full items-center gap-3 rounded-xl border border-line bg-white/70 p-3 text-left transition-[border-color,background-color,transform] duration-300 hover:border-line-strong focus-visible:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
                style={{ transform: isActive || isFocused ? "translateX(-3px)" : undefined }}
                onClick={() => choose(item.id)}
                onPointerEnter={(event: PointerEvent<HTMLButtonElement>) => {
                  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
                    setFocused(item.id);
                    choose(item.id);
                  }
                }}
                onPointerLeave={() => setFocused(null)}
                onFocus={() => setFocused(item.id)}
                onBlur={() => setFocused(null)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span aria-hidden className={cn("mt-0.5 size-2 shrink-0 rounded-full transition-colors", isActive ? "bg-blush-400" : "bg-cloud-300 group-hover:bg-blush-200")} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.label}</span>
                  {item.meta ? <span className="mt-0.5 block truncate text-[0.6875rem] text-ink-500">{item.meta}</span> : null}
                </span>
                <span aria-hidden className="ml-auto font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
