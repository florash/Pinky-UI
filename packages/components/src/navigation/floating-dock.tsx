"use client";

import { Proximity, useProximityItem, useMotionEnabled } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type DockItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
};

export type FloatingDockProps = {
  items: DockItem[];
  /** Scale of the item directly under the pointer. Restrained by default. */
  magnification?: number;
  /** Distance in px over which the effect falls off. */
  distance?: number;
  /** Show the label under the hovered item. */
  labels?: boolean;
  "aria-label"?: string;
  className?: string;
};

/**
 * A dock whose items swell as the pointer travels along it.
 *
 * The magnification is an enhancement layered on an ordinary list of links and
 * buttons: it never changes what is clickable, it is skipped entirely for touch
 * and reduced motion, and every item keeps a permanent accessible name rather
 * than relying on the hover label.
 */
export function FloatingDock({
  items,
  magnification = 1.35,
  distance = 120,
  labels = true,
  className,
  "aria-label": ariaLabel = "Dock",
}: FloatingDockProps) {
  return (
    <Proximity distance={distance} axis="x">
      <nav aria-label={ariaLabel} className={cn("inline-flex", className)}>
        <ul className="flex items-end gap-1.5 rounded-2xl bg-white/85 px-2 py-2 shadow-soft ring-1 ring-line">
          {items.map((item) => (
            <DockButton key={item.id} item={item} magnification={magnification} labels={labels} />
          ))}
        </ul>
      </nav>
    </Proximity>
  );
}

function DockButton({
  item,
  magnification,
  labels,
}: {
  item: DockItem;
  magnification: number;
  labels: boolean;
}) {
  const { ref, proximity } = useProximityItem<HTMLLIElement>();
  const motionEnabled = useMotionEnabled();

  const scale = useTransform(proximity, [0, 1], [1, magnification]);
  const lift = useTransform(proximity, [0, 1], [0, -6]);
  const labelOpacity = useTransform(proximity, [0.55, 1], [0, 1]);

  const content = (
    <>
      <span aria-hidden className="grid size-5 shrink-0 place-items-center">
        {item.icon}
      </span>
      <span className={item.active && labels ? "text-xs font-medium whitespace-nowrap" : "sr-only"}>
        {item.label}
      </span>
    </>
  );

  const surface = cn(
    "relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    item.active
      ? "bg-ink-900 text-milk shadow-soft"
      : "bg-blush-50 text-ink-700 hover:bg-blush-100 hover:text-ink-900",
  );

  return (
    <li ref={ref} className="relative flex flex-col items-center">
      {labels && !item.active ? (
        <motion.span
          aria-hidden
          style={motionEnabled ? { opacity: labelOpacity } : { opacity: 0 }}
          className="pointer-events-none absolute -top-9 rounded-pill bg-ink-900 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] whitespace-nowrap text-milk uppercase"
        >
          {item.label}
        </motion.span>
      ) : null}

      <motion.div layout={motionEnabled} style={motionEnabled ? { scale, y: lift } : undefined} className="origin-bottom">
        {item.href ? (
          <a
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={surface}
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            aria-pressed={item.active}
            onClick={item.onSelect}
            className={surface}
          >
            {content}
          </button>
        )}
      </motion.div>
    </li>
  );
}
