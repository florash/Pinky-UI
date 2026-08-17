"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

const CELLS = Array.from({ length: 9 }, (_, i) => ({ col: i % 3, row: Math.floor(i / 3), i }));

/**
 * Construction: a 3×3 field of dots — the app-launcher lineage (Google's
 * waffle). No lines anywhere.
 *
 * Motion signature — **radial stagger, then collapse to a cross**. Hover pushes
 * each dot outward from the centre by an amount proportional to its distance,
 * so the grid breathes rather than lifting. Open keeps only the diagonals: the
 * four edge-centre dots fade and the remaining five settle into an ×, which is
 * a close mark the grid already contained.
 */
export const DotGrid = forwardRef<HTMLButtonElement, MenuTriggerBase>(function DotGrid(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const spread = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    Math.max(0, (h ?? 0) - (p ?? 0) * 1.4),
  );

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn(
        "relative grid size-12 place-items-center rounded-[13px] border border-[color:var(--color-line)] bg-white",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <span aria-hidden className="relative block size-5">
        {CELLS.map(({ col, row, i }) => {
          const dx = col - 1;
          const dy = row - 1;
          const isDiagonal = Math.abs(dx) === Math.abs(dy);
          return (
            <motion.span
              key={i}
              className="absolute block size-[3.5px] rounded-full bg-ink-900"
              style={{ left: col * 8, top: row * 8 }}
              initial={false}
              animate={{
                // Open keeps the diagonals; the edge dots step aside.
                opacity: isOpen && !isDiagonal ? 0 : 1,
                scale: isOpen && !isDiagonal ? 0.4 : 1,
                x: (isOpen ? 0 : 1) * dx * 1.6,
                y: (isOpen ? 0 : 1) * dy * 1.6,
              }}
              transition={spring}
            />
          );
        })}
        <motion.span
          aria-hidden
          className="absolute inset-0"
          style={{ scale: useTransform(spread, (v) => 1 + v * 0.12) }}
        />
      </span>
    </motion.button>
  );
});
