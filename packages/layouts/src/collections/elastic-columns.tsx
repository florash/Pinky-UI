"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { mod, useControllable } from "../internal/use-controllable";
import { useCompactLayout } from "../internal/use-compact-layout";

export type ElasticColumn = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
};

export type ElasticColumnsProps = {
  columns: ElasticColumn[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** Reallocates real grid width around the selected column; it never fakes expansion with scale. */
export function ElasticColumns({
  columns,
  activeId,
  defaultActiveId,
  onActiveIdChange,
  label = "Elastic columns",
  className,
  disabled = false,
}: ElasticColumnsProps) {
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled() && !disabled;
  const [currentId, setCurrentId] = useControllable(activeId, defaultActiveId ?? columns[0]?.id ?? "", onActiveIdChange);
  const [focused, setFocused] = useState<string | null>(null);
  const activeIndex = Math.max(0, columns.findIndex((column) => column.id === currentId));
  if (!columns.length) return null;
  const choose = (id: string) => setCurrentId(id);
  const template = compact ? "1fr" : columns.map((_, index) => index === activeIndex ? "1.7fr" : "0.82fr").join(" ");

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? columns.length - 1 : mod(index + (event.key === "ArrowRight" ? 1 : -1), columns.length);
    choose(columns[next]?.id ?? columns[0]?.id ?? "");
  };

  return (
    <div aria-label={label} className={cn("space-y-3", className)}>
      <div className={cn("grid", compact ? "gap-3" : "gap-2")} style={{ gridTemplateColumns: template, transition: motionEnabled ? "grid-template-columns 480ms cubic-bezier(.22,1,.36,1)" : "none" }}>
        {columns.map((column, index) => {
          const isActive = index === activeIndex;
          const isFocused = column.id === focused;
          return (
            <motion.section key={column.id} layout={motionEnabled} className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white" animate={motionEnabled ? { opacity: isActive || isFocused ? 1 : 0.86 } : { opacity: 1 }} transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}>
              <button
                type="button"
                aria-expanded={compact ? isActive : undefined}
                aria-controls={`elastic-column-${column.id}`}
                aria-pressed={isActive}
                className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-cloud-50 focus-visible:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/20"
                onClick={() => choose(column.id)}
                onPointerEnter={(event: PointerEvent<HTMLButtonElement>) => {
                  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
                    setFocused(column.id);
                    choose(column.id);
                  }
                }}
                onPointerLeave={() => setFocused(null)}
                onFocus={() => setFocused(column.id)}
                onBlur={() => setFocused(null)}
                onKeyDown={(event) => keyDown(event, index)}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{column.label}</span>
                  {column.meta ? <span className="mt-0.5 block truncate text-xs text-ink-500">{column.meta}</span> : null}
                </span>
                <span aria-hidden className={cn("size-2 shrink-0 rounded-full transition-colors", isActive ? "bg-blush-400" : "bg-cloud-200")} />
              </button>
              <div id={`elastic-column-${column.id}`} hidden={compact && !isActive} className="p-3 sm:p-4">{column.content}</div>
            </motion.section>
          );
        })}
      </div>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">Select a column to change the composition</p>
    </div>
  );
}
