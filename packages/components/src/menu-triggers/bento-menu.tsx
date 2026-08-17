"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

const QUADS = [
  { x: 0, y: 0, dx: -1, dy: -1 },
  { x: 11, y: 0, dx: 1, dy: -1 },
  { x: 0, y: 11, dx: -1, dy: 1 },
  { x: 11, y: 11, dx: 1, dy: 1 },
] as const;

/**
 * Construction: four rounded squares in a 2×2 block — the waffle lineage
 * (Microsoft), and the shape the current "bento" layout trend borrowed.
 * Squares, not dots and not lines.
 *
 * Motion signature — **the gap breathes, then the block turns**. Hover widens
 * the gutter between the four tiles by pushing each outward along its own
 * diagonal, so the composition loosens in place. Open rotates the whole block
 * 45° and collapses one diagonal pair, leaving two tiles on an axis — a close
 * mark built from the same four squares rather than swapped for a cross.
 */
export const BentoMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function BentoMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const gap = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    Math.max(0, (h ?? 0) - (p ?? 0) * 1.5) * 1.6,
  );
  const pos = useTransform(gap, (v) => v);
  const neg = useTransform(gap, (v) => -v);

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
      <motion.span
        aria-hidden
        className="relative block size-5"
        initial={false}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={spring}
      >
        {QUADS.map((q, i) => (
          <motion.span
            key={i}
            className="absolute block size-[9px] rounded-[3px] bg-ink-900"
            style={{ left: q.x, top: q.y, x: q.dx > 0 ? pos : neg, y: q.dy > 0 ? pos : neg }}
            initial={false}
            animate={{
              // One diagonal pair steps out so the remaining pair reads as a bar.
              opacity: isOpen && i % 3 === 0 ? 0 : 1,
              scale: isOpen && i % 3 === 0 ? 0.5 : 1,
            }}
            transition={spring}
          />
        ))}
      </motion.span>
    </motion.button>
  );
});
