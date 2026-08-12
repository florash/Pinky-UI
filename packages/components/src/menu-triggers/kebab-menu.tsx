"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: three vertical dots inside a narrow **recessed chamber** — the
 * Material overflow lineage, given a well so it reads as a fixture in a toolbar
 * rather than something floating on top of one.
 *
 * Motion signature — **the column merges**. Hover lifts the outer plate while
 * the chamber holds, deepening the well. Open pulls the three dots together
 * until they fuse into a single vertical bar: the mark simplifies instead of
 * rotating, which is the only close state in this set that stays orthogonal.
 * A diagonal inside a tall narrow recess fights the chamber's own edges.
 */
export const KebabMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function KebabMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const plateY = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    (h ?? 0) * -2 + (p ?? 0) * 3,
  );
  const chamberY = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    (h ?? 0) * 0.5 + (p ?? 0) * 1.4,
  );

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y: plateY }}
      className={cn(
        "relative grid h-12 w-9 place-items-center rounded-[13px] border border-[color:var(--color-line)] bg-[color-mix(in_oklab,white_88%,var(--color-cloud-50))] p-1.5",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <motion.span
        aria-hidden
        style={{ y: chamberY }}
        className="grid size-full place-items-center rounded-pill bg-cloud-50 [box-shadow:var(--depth-inset)]"
      >
        <span className="relative block h-4 w-1">
          {[0, 6, 12].map((top, i) => (
            <motion.span
              key={top}
              className="absolute left-0 block size-1 rounded-full bg-ink-900"
              initial={false}
              animate={{ top: isOpen ? 6 : top, scaleY: isOpen ? 2.6 : 1, borderRadius: isOpen ? 2 : 99 }}
              transition={{ ...spring, delay: isOpen ? i * 0.02 : 0 }}
            />
          ))}
        </span>
      </motion.span>
    </motion.button>
  );
});
