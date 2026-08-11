"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { useControllable, mod } from "../internal/use-controllable";

export type SplitScreenGalleryItem = {
  id: string;
  label: string;
  primary: ReactNode;
  secondary: ReactNode;
  meta?: ReactNode;
};

export type SplitScreenGalleryProps = {
  items: SplitScreenGalleryItem[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** Two coordinated media planes with explicit controls and a touch swipe path. */
export function SplitScreenGallery({
  items,
  index,
  defaultIndex = 0,
  onIndexChange,
  label = "Split-screen gallery",
  className,
  disabled = false,
}: SplitScreenGalleryProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [selected, setSelected] = useControllable(index, mod(defaultIndex, Math.max(items.length, 1)), onIndexChange);
  const startX = useRef<number | null>(null);
  const current = items[selected] ?? items[0];
  const enabled = motionEnabled && !disabled;
  const next = (delta: number) => {
    if (items.length === 0) return;
    setSelected(mod(selected + delta, items.length));
  };

  if (!current) return null;

  return (
    <section aria-label={label} className={cn("w-full", className)}>
      <div
        className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-2")}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (event.pointerType === "touch") startX.current = event.clientX;
        }}
        onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
          if (startX.current === null) return;
          const distance = event.clientX - startX.current;
          if (Math.abs(distance) > 42) next(distance < 0 ? 1 : -1);
          startX.current = null;
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <GalleryPane side="primary" item={current} enabled={enabled} />
        <GalleryPane side="secondary" item={current} enabled={enabled} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{current.label}</p>
          {current.meta ? <p className="mt-1 text-xs text-ink-500">{current.meta}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => next(-1)} aria-label="Previous split-screen item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button>
          <span aria-live="polite" className="min-w-16 text-center font-mono text-xs text-ink-500">{selected + 1} / {items.length}</span>
          <button type="button" onClick={() => next(1)} aria-label="Next split-screen item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button>
        </div>
      </div>
    </section>
  );
}

function GalleryPane({ side, item, enabled }: { side: "primary" | "secondary"; item: SplitScreenGalleryItem; enabled: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${item.id}-${side}`}
        tabIndex={0}
        className="group relative min-h-56 overflow-hidden rounded-2xl border border-line bg-cloud-50 outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
        initial={enabled ? { opacity: 0, x: side === "primary" ? -10 : 10 } : false}
        animate={{ opacity: 1, x: 0 }}
        exit={enabled ? { opacity: 0, x: side === "primary" ? 10 : -10 } : undefined}
        transition={enabled ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      >
        <motion.div whileHover={enabled ? { scale: 1.012 } : undefined} whileFocus={enabled ? { scale: 1.012 } : undefined} transition={{ type: "spring", ...springs.soft }} className="size-full">
          {side === "primary" ? item.primary : item.secondary}
        </motion.div>
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.div>
    </AnimatePresence>
  );
}
