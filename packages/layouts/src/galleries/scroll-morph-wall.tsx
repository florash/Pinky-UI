"use client";

import { useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ScrollMorphWallItem = {
  id: string;
  label?: string;
  meta?: string;
  content: ReactNode;
};

export type ScrollMorphWallProps = {
  items: ScrollMorphWallItem[];
  /** How much scroll the transformation takes, in viewport heights. */
  travel?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
};

type Point = { x: number; y: number; scale: number; rotate: number; z: number };

function gridPoint(index: number, count: number): Point {
  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / columns));
  const col = index % columns;
  const row = Math.floor(index / columns);
  return {
    x: ((col + 0.5) / columns) * 100,
    y: ((row + 0.5) / rows) * 100,
    scale: 1,
    rotate: 0,
    z: index,
  };
}

function orbitPoint(index: number, count: number): Point {
  const angle = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * 34,
    y: 50 + Math.sin(angle) * 30,
    scale: 0.82,
    rotate: (angle * 180) / Math.PI + 90,
    z: index,
  };
}

function stackPoint(index: number, count: number): Point {
  const center = (count - 1) / 2;
  const offset = index - center;
  return {
    x: 50 + offset * 4,
    y: 50 + offset * 2.4,
    scale: 0.95,
    rotate: offset * 7,
    z: count - Math.abs(offset),
  };
}

/**
 * A collection whose arrangement is a function of scroll, not a fixed grid.
 *
 * The wall reads as a grid at rest, gathers into a ring mid-scroll and settles
 * into a fanned deck by the end — one continuous interpolation driven by
 * `scrollYProgress`, not three separate layouts swapped at breakpoints. Touch,
 * reduced motion and narrow viewports fall back to a static grid: the
 * transformation is the enhancement, the content order is the content.
 */
export function ScrollMorphWall({ items, travel = 2.4, label = "Scroll morph wall", className, disabled = false }: ScrollMorphWallProps) {
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();
  const sectionRef = useRef<HTMLElement>(null);
  const enabled = motionEnabled && !disabled && hasHover && items.length > 0;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className={cn("relative w-full", className)}
      style={enabled ? { height: `${travel * 100}vh` } : undefined}
    >
      {enabled ? (
        <div className="sticky top-16 h-[70vh] overflow-hidden rounded-[28px] border border-line bg-white/60">
          {items.map((item, index) => (
            <WallItem key={item.id} item={item} index={index} count={items.length} progress={scrollYProgress} />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              {item.content}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WallItem({
  item,
  index,
  count,
  progress,
}: {
  item: ScrollMorphWallItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const grid = gridPoint(index, count);
  const orbit = orbitPoint(index, count);
  const stack = stackPoint(index, count);

  const left = useTransform(progress, [0, 0.5, 1], [grid.x, orbit.x, stack.x]);
  const top = useTransform(progress, [0, 0.5, 1], [grid.y, orbit.y, stack.y]);
  const scale = useTransform(progress, [0, 0.5, 1], [grid.scale, orbit.scale, stack.scale]);
  const rotate = useTransform(progress, [0, 0.5, 1], [grid.rotate, orbit.rotate, stack.rotate]);
  const zIndex = useTransform(progress, [0, 0.5, 1], [grid.z, orbit.z, stack.z]);

  return (
    <motion.figure
      className="absolute flex w-[32%] max-w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
      style={{ left: useTransform(left, (value) => `${value}%`), top: useTransform(top, (value) => `${value}%`), scale, rotate, zIndex }}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">{item.content}</div>
      {item.label ? (
        <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="truncate text-xs font-medium text-ink-900">{item.label}</span>
          {item.meta ? <span className="font-mono text-[0.6rem] text-ink-500">{item.meta}</span> : null}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
