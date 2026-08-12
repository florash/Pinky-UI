"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: three horizontal dots in a pill — the overflow-menu lineage
 * (iOS, Notion, Figma). The shell is a wide capsule rather than a square, which
 * is what distinguishes a "more" affordance from a primary navigation trigger.
 *
 * Motion signature — **spread, then fold into a diagonal**. Hover widens the
 * gaps between the dots without moving the shell. Open swings the outer two
 * around the centre onto a diagonal and shrinks the middle out of the way, so
 * the row becomes a compact close mark without ever drawing a line.
 */
export const MeatballMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function MeatballMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const spread = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    Math.max(0, (h ?? 0) - (p ?? 0)) * 2,
  );
  const outLeft = useTransform(spread, (v) => -v);
  const outRight = useTransform(spread, (v) => v);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn(
        "relative grid h-9 w-14 place-items-center rounded-pill border border-[color:var(--color-line)] bg-white",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <span aria-hidden className="relative block h-1 w-5">
        <motion.span
          className="absolute top-0 left-0 block size-1 rounded-full bg-ink-900"
          style={{ x: outLeft }}
          initial={false}
          animate={isOpen ? { y: -4, x: 4, scale: 1 } : { y: 0, scale: 1 }}
          transition={spring}
        />
        <motion.span
          className="absolute top-0 left-2 block size-1 rounded-full bg-ink-900"
          initial={false}
          animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={spring}
        />
        <motion.span
          className="absolute top-0 left-4 block size-1 rounded-full bg-ink-900"
          style={{ x: outRight }}
          initial={false}
          animate={isOpen ? { y: 4, x: -4 } : { y: 0 }}
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
