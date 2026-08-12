"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { mod, useControllable } from "../internal/use-controllable";
import { useCompactLayout } from "../internal/use-compact-layout";

export type SplitNarrativeItem = {
  id: string;
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  balance?: "primary" | "secondary";
};

export type SplitNarrativeProps = {
  items: SplitNarrativeItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** A two-plane story whose proportions change with the active chapter. */
export function SplitNarrative({
  items,
  activeId,
  defaultActiveId,
  onActiveIdChange,
  label = "Split narrative",
  className,
  disabled = false,
}: SplitNarrativeProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [currentId, setCurrentId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const [focused, setFocused] = useState<string | null>(null);
  const selected = items.find((item) => item.id === currentId) ?? items[0];
  if (!selected) return null;
  const selectedIndex = items.findIndex((item) => item.id === selected.id);
  const columns = compact ? "1fr" : selected.balance === "secondary" ? "62% 38%" : "42% 58%";
  const choose = (id: string) => setCurrentId(id);

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : mod(selectedIndex + (event.key === "ArrowRight" ? 1 : -1), items.length);
    choose(items[nextIndex]?.id ?? selected.id);
  };

  return (
    <div className={cn("space-y-5", className)}>
      <motion.div
        aria-label={label}
        className="grid gap-3 overflow-hidden rounded-2xl"
        style={{ gridTemplateColumns: columns, transition: motionEnabled ? "grid-template-columns 520ms cubic-bezier(.22,1,.36,1)" : "none" }}
      >
        <section className="relative min-h-52 overflow-hidden rounded-2xl bg-ink-900 p-5 text-milk sm:p-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${selected.id}-primary`} initial={motionEnabled ? { opacity: 0, x: -20 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: 20 } : undefined} transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }} className="h-full">
              {selected.primary}
            </motion.div>
          </AnimatePresence>
        </section>
        <section className="relative min-h-52 overflow-hidden rounded-2xl bg-cloud-100 p-5 sm:p-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${selected.id}-secondary`} initial={motionEnabled ? { opacity: 0, x: 20 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: -20 } : undefined} transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }} className="h-full">
              {selected.secondary}
            </motion.div>
          </AnimatePresence>
        </section>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div aria-live="polite" className="max-w-xl">
          {selected.kicker ? <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">{selected.kicker}</p> : null}
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{selected.title}</h3>
          {selected.description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{selected.description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Story chapters">
          {items.map((item, index) => {
            const isActive = item.id === selected.id;
            const isFocused = item.id === focused;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                aria-pressed={isActive}
                className="rounded-pill border border-line bg-white px-3 py-2 text-left text-xs transition-[background-color,border-color,transform] duration-300 hover:border-line-strong focus-visible:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
                style={{ transform: isActive || isFocused ? "translateY(-2px)" : undefined }}
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
                onKeyDown={keyDown}
              >
                <span className="mr-1.5 font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span>{item.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
