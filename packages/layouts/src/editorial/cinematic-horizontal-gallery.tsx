"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { clamp, mod, useControllable } from "../internal/use-controllable";

export type CinematicGalleryItem = { id: string; label: string; content: ReactNode; meta?: ReactNode; width?: string | number };
export type CinematicHorizontalGalleryProps = {
  items: CinematicGalleryItem[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  verticalMapping?: boolean;
  gap?: number;
  loop?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** A media browsing rail; unlike HorizontalStory it is a collection, not a narrative. */
export function CinematicHorizontalGallery({
  items,
  index,
  defaultIndex = 0,
  onIndexChange,
  verticalMapping = false,
  gap = 18,
  loop = false,
  label = "Cinematic horizontal gallery",
  className,
  disabled = false,
}: CinematicHorizontalGalleryProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useControllable(index, mod(defaultIndex, Math.max(items.length, 1)), onIndexChange);
  const maxX = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const scrollX = useTransform(scrollYProgress, (value) => -value * maxX.get());
  const enabled = motionEnabled && !disabled;
  const mapped = verticalMapping && enabled && !compact;

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const measure = () => maxX.set(Math.max(node.scrollWidth - node.clientWidth, 0));
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(node);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length, gap, maxX]);

  const select = (next: number) => {
    if (!items.length) return;
    const resolved = loop ? mod(next, items.length) : clamp(next, 0, items.length - 1);
    setSelected(resolved);
    rail.current?.children[resolved]?.scrollIntoView?.({ behavior: enabled ? "smooth" : "auto", block: "nearest", inline: "center" });
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); select(selected + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); select(selected - 1); }
    if (event.key === "Home") { event.preventDefault(); select(0); }
    if (event.key === "End") { event.preventDefault(); select(items.length - 1); }
  };

  return (
    <section ref={section} aria-label={label} className={cn(mapped ? "min-h-[180vh]" : "", className)}>
      <div className={mapped ? "sticky top-0 flex min-h-screen items-center overflow-hidden" : ""}>
        <div className="w-full">
          <div ref={rail} role="list" tabIndex={0} aria-label={label} onKeyDown={keyDown} className={cn("flex max-w-full overflow-x-auto px-1 pb-3 outline-none", mapped ? "overflow-hidden" : "snap-x snap-mandatory", "focus-visible:ring-2 focus-visible:ring-ink-900")} style={{ gap }}>
            <motion.div className="flex shrink-0 items-stretch" style={{ x: mapped ? scrollX : 0, gap }}>
              {items.map((item, itemIndex) => (
                <motion.article
                  key={item.id}
                  role="listitem"
                  className="group snap-center shrink-0 overflow-hidden rounded-[26px] border border-line bg-white shadow-soft"
                  style={{ width: item.width ?? "min(74vw, 620px)" }}
                  onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setSelected(itemIndex); }}
                  onFocus={() => setSelected(itemIndex)}
                  whileHover={enabled ? { y: -5, scale: 1.012 } : undefined}
                  transition={{ type: "spring", ...springs.soft }}
                >
                  <div className="relative overflow-hidden">{item.content}<span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" /></div>
                  <div className="flex items-baseline justify-between gap-4 p-5"><h3 className="font-display text-lg font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div>
                </motion.article>
              ))}
            </motion.div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items.length ? `${selected + 1} / ${items.length}` : "0 items"}</p><div className="flex gap-2"><button type="button" onClick={() => select(selected - 1)} aria-label="Previous gallery item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => select(selected + 1)} aria-label="Next gallery item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div>
        </div>
      </div>
    </section>
  );
}
