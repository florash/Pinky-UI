"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import { cn } from "../utils/cn";

export type PillNavItem = {
  id: string;
  label: ReactNode;
  /** A plain link. Omit and supply `onClick` for a trigger item (e.g. a dropdown) instead. */
  href?: string;
  onClick?: () => void;
  /** Whether this item represents the current route. The component never guesses this itself — no router assumption. */
  active: boolean;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu";
  "aria-controls"?: string;
  ref?: (node: HTMLAnchorElement | HTMLButtonElement | null) => void;
  /** Extra content anchored to this item — e.g. a dropdown panel. Renders inside a `position: relative` wrapper around the item. */
  panel?: ReactNode;
};

export type PillNavProps = {
  items: PillNavItem[];
  size?: "sm" | "md";
  /** Horizontal scroll for a narrow track. Off by default — an explicit `overflow-x` forces `overflow-y` to compute as `auto` too, which clips any item's dropdown `panel`. */
  scrollable?: boolean;
  "aria-label"?: string;
  className?: string;
};

const SIZES = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-10 px-3.5 text-sm",
} as const;

/**
 * Real navigation links with a shared pill background that slides to
 * whichever one is current — Fluid Tabs' indicator mechanic, applied to
 * `<a href>` instead of tab buttons. The active item is supplied by the
 * caller (via its own router), never guessed here.
 */
export function PillNav({ items, size = "md", scrollable = false, "aria-label": ariaLabel = "Navigation", className }: PillNavProps) {
  const baseId = useId();
  const motionEnabled = useMotionEnabled();

  const stretchTarget = useMotionValue(1);
  const stretch = useSpring(stretchTarget, springs.elastic);
  const activeId = items.find((item) => item.active)?.id;
  const previousActive = useRef(activeId);

  useEffect(() => {
    if (!motionEnabled || previousActive.current === activeId) {
      previousActive.current = activeId;
      return;
    }
    previousActive.current = activeId;
    stretchTarget.set(1.08);
    const timer = setTimeout(() => stretchTarget.set(1), 90);
    return () => clearTimeout(timer);
  }, [activeId, motionEnabled, stretchTarget]);

  const transition = motionEnabled ? { type: "spring" as const, ...springs.responsive } : { duration: 0 };

  return (
    <nav aria-label={ariaLabel} className={cn("relative inline-flex max-w-full items-center gap-1 rounded-pill p-1", scrollable && "overflow-x-auto", className)}>
      {items.map((item) => {
        const itemClassName = cn(
          "relative isolate shrink-0 rounded-pill font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2",
          "inline-flex items-center transition-colors duration-200 ease-[var(--ease-soft)]",
          SIZES[size],
          item.active ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
        );
        const indicator = item.active ? (
          <motion.span aria-hidden layoutId={`${baseId}-pill`} transition={transition} className="absolute inset-0 -z-10">
            <motion.span
              className="block size-full rounded-pill bg-white shadow-soft ring-1 ring-line"
              style={{ scaleX: motionEnabled ? stretch : 1 }}
            />
          </motion.span>
        ) : null;

        if (item.href) {
          return (
            <a key={item.id} ref={item.ref} href={item.href} onClick={item.onClick} aria-current={item.active ? "page" : undefined} className={itemClassName}>
              {indicator}
              <span className="relative">{item.label}</span>
            </a>
          );
        }

        return (
          <div key={item.id} className="relative">
            <button
              ref={item.ref}
              type="button"
              onClick={item.onClick}
              aria-expanded={item["aria-expanded"]}
              aria-haspopup={item["aria-haspopup"]}
              aria-controls={item["aria-controls"]}
              className={itemClassName}
            >
              {indicator}
              <span className="relative flex items-center gap-1">{item.label}</span>
            </button>
            {item.panel}
          </div>
        );
      })}
    </nav>
  );
}
