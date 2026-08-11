"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";
import { useMediaQuery } from "../internal/use-media-query";

export type SpatialCarouselItem = { id: string; label: string; content: ReactNode };

export type SpatialCarouselProps = {
  items: SpatialCarouselItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  loop?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
};

/** A carousel where adjacent slides recede in depth instead of only translating. */
export function SpatialCarousel({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
  loop = true,
  className,
  disabled = false,
  label = "Carousel",
}: SpatialCarouselProps) {
  const [selected, setSelected] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveChange);
  const motionEnabled = useMotionEnabled();
  const compact = useMediaQuery("(max-width: 767px)");
  const flat = disabled || !motionEnabled || compact;
  const activeIndex = Math.max(items.findIndex((item) => item.id === selected), 0);

  const move = (delta: number) => {
    if (items.length === 0) return;
    let next = activeIndex + delta;
    if (loop) next = (next + items.length) % items.length;
    else next = Math.min(Math.max(next, 0), items.length - 1);
    const item = items[next];
    if (item) setSelected(item.id);
  };

  const keys = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home" && items[0]) {
      event.preventDefault();
      setSelected(items[0].id);
    } else if (event.key === "End" && items.at(-1)) {
      event.preventDefault();
      setSelected(items.at(-1)!.id);
    }
  };

  return (
    <section aria-label={label} aria-roledescription="carousel" onKeyDown={keys} className={cn("relative", className)}>
      <div className="relative mx-auto min-h-[340px] overflow-hidden" style={{ perspective: flat ? undefined : 1100 }}>
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const active = offset === 0;
          return (
            <motion.article
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}: ${item.label}`}
              aria-hidden={Math.abs(offset) > 1}
              className="absolute top-1/2 left-1/2 w-[min(72vw,520px)]"
              initial={false}
              animate={
                flat
                  ? { x: `calc(-50% + ${offset * 76}%)`, y: "-50%", z: 0, rotateY: 0, scale: active ? 1 : 0.94, opacity: Math.abs(offset) > 1 ? 0 : 0.62 }
                  : { x: `calc(-50% + ${offset * 64}%)`, y: "-50%", z: Math.abs(offset) * -140, rotateY: offset * -8, scale: active ? 1 : 0.9, opacity: Math.abs(offset) > 2 ? 0 : active ? 1 : 0.58 }
              }
              transition={{ type: "spring", stiffness: 210, damping: 30, mass: 1 }}
              style={{ zIndex: items.length - Math.abs(offset), pointerEvents: active ? "auto" : "none" }}
            >
              {item.content}
            </motion.article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={() => move(-1)} disabled={!loop && activeIndex === 0} aria-label="Previous slide" className="rounded-[999px] border border-[color:var(--color-line,rgba(70,90,115,.1))] px-4 py-2">←</button>
        <span aria-live="polite" className="min-w-20 text-center text-sm text-[color:var(--color-ink-500,#7b8492)]">
          {items[activeIndex]?.label ?? ""}
        </span>
        <button type="button" onClick={() => move(1)} disabled={!loop && activeIndex === items.length - 1} aria-label="Next slide" className="rounded-[999px] border border-[color:var(--color-line,rgba(70,90,115,.1))] px-4 py-2">→</button>
      </div>
    </section>
  );
}
