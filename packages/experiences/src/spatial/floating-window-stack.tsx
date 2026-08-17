"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";
import { useMediaQuery } from "../internal/use-media-query";

export type FloatingWindow = { id: string; title: string; content: ReactNode };

export type FloatingWindowStackProps = {
  windows: FloatingWindow[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
};

/** Overlapping product windows whose focused surface comes quietly forward. */
export function FloatingWindowStack({
  windows,
  activeId,
  defaultActiveId,
  onActiveChange,
  className,
  disabled = false,
  label = "Product windows",
}: FloatingWindowStackProps) {
  const [selected, setSelected] = useControllable(activeId, defaultActiveId ?? windows[0]?.id ?? "", onActiveChange);
  const motionEnabled = useMotionEnabled();
  const compact = useMediaQuery("(max-width: 767px)");
  const flat = disabled || !motionEnabled || compact;

  return (
    <div aria-label={label} className={cn("relative", flat ? "grid gap-4" : "min-h-[430px]", className)}>
      {windows.map((windowItem, index) => {
        const active = windowItem.id === selected;
        return (
          <motion.section
            key={windowItem.id}
            aria-label={windowItem.title}
            className="overflow-hidden rounded-[22px] border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white shadow-[0_20px_60px_rgba(37,41,51,.12)]"
            initial={false}
            animate={flat ? { x: 0, y: 0, scale: 1, opacity: 1 } : { x: index * 28, y: index * 34, scale: active ? 1 : 0.94, opacity: active ? 1 : 0.74 }}
            transition={{ type: "spring", stiffness: 210, damping: 30, mass: 1 }}
            style={flat ? undefined : { position: "absolute", inset: "0 auto auto 0", width: "min(86%, 680px)", zIndex: active ? windows.length + 1 : index }}
          >
            <header className="flex items-center gap-3 border-b border-[color:var(--color-line,rgba(70,90,115,.1))] px-4 py-3">
              <span aria-hidden className="flex gap-1.5"><i className="size-2 rounded-full bg-[color:var(--color-blush-300,#f4c7d7)]" /><i className="size-2 rounded-full bg-[color:var(--color-cloud-300,#c8e4f7)]" /></span>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(windowItem.id)}
                className="min-w-0 flex-1 text-left text-sm font-medium"
              >
                {windowItem.title}
              </button>
            </header>
            <div>{windowItem.content}</div>
          </motion.section>
        );
      })}
    </div>
  );
}
