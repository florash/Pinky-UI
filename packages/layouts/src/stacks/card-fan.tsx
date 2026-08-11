"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { Children, useState, type KeyboardEvent, type ReactNode } from "react";

export type CardFanProps = {
  children: ReactNode;
  /** Horizontal distance between cards when fanned, in px. */
  spread?: number;
  /** Rotation of the outermost cards, in degrees. */
  rotation?: number;
  /** Controlled selection. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** Start collapsed and fan out on interaction. */
  collapsible?: boolean;
  label?: string;
  className?: string;
};

/**
 * Cards held like a hand of playing cards.
 *
 * Fanned, each card is individually reachable; collapsed, they gather into a
 * pile. Selection is a roving tab stop with arrow keys, so the fan can be read
 * and browsed without a pointer — the spatial arrangement is presentation, and
 * the list underneath stays an ordinary list.
 */
export function CardFan({
  children,
  spread = 28,
  rotation = 8,
  activeIndex,
  onActiveIndexChange,
  collapsible = true,
  label = "Card fan",
  className,
}: CardFanProps) {
  const motionEnabled = useMotionEnabled();
  const items = Children.toArray(children);
  const [internalActive, setInternalActive] = useState(0);
  const [open, setOpen] = useState(!collapsible);
  const active = activeIndex ?? internalActive;

  const setActive = (index: number) => {
    const next = Math.min(Math.max(index, 0), items.length - 1);
    if (activeIndex === undefined) setInternalActive(next);
    onActiveIndexChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") setActive(active + 1);
    else if (event.key === "ArrowLeft") setActive(active - 1);
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(items.length - 1);
    else return;
    event.preventDefault();
  };

  const middle = (items.length - 1) / 2;

  return (
    <div className={className}>
      <ul
        aria-label={label}
        onKeyDown={onKeyDown}
        onMouseEnter={() => collapsible && setOpen(true)}
        onMouseLeave={() => collapsible && setOpen(false)}
        onFocusCapture={() => collapsible && setOpen(true)}
        onBlurCapture={(event) => {
          if (collapsible && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        className="relative mx-auto flex list-none justify-center p-0"
        style={{ height: 260 }}
      >
        {items.map((child, index) => {
          const distance = index - middle;
          const isActive = index === active;
          const fanned = open || !collapsible;

          return (
            <motion.li
              key={index}
              className="absolute top-0 origin-bottom"
              style={{ zIndex: isActive ? items.length + 1 : index }}
              animate={
                motionEnabled
                  ? {
                      x: fanned ? distance * spread * 2 : distance * 6,
                      rotate: fanned ? (distance / Math.max(middle, 1)) * rotation : distance * 1.5,
                      y: isActive && fanned ? -18 : 0,
                      scale: isActive && fanned ? 1.03 : 1,
                    }
                  : { x: distance * spread * 2, rotate: 0, y: 0, scale: 1 }
              }
              transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
            >
              <div
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActive(index);
                  }
                }}
                className="cursor-pointer rounded-xl focus-visible:outline-2"
              >
                {child}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
