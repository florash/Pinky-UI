"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: a plain pill whose two lines are the only moving parts — but
 * they are not rigid. Their *length* is the animated property.
 *
 * Motion signature — **elastic length**. No translation, no rotation on hover:
 * the upper line stretches a little past its resting width while the lower one
 * contracts, as though the pair were one piece of material being drawn. Press
 * compresses both. This is the only trigger in the set where nothing moves
 * position — the geometry changes in place.
 *
 * The elasticity is deliberately capped at a few pixels and damped hard. The
 * failure mode for this idea is cartoon rubber, and the difference between
 * premium and toy here is entirely the amplitude.
 */
export const ElasticLines = forwardRef<HTMLButtonElement, MenuTriggerBase>(function ElasticLines(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement("elastic");
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  const stretch = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) - (pressed ?? 0) * 1.6,
  );
  // Upper extends, lower contracts — the pair reads as one drawn material.
  const topWidth = useTransform(stretch, (v) => 20 + v * 4);
  const bottomWidth = useTransform(stretch, (v) => 13 - v * 3);
  const surfaceY = useTransform(press.pressed, (v) => v * 1.5);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y: surfaceY }}
      className={cn(
        "relative grid h-12 w-14 place-items-center rounded-pill border border-[color:var(--color-line)] bg-white",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "active:[box-shadow:var(--depth-pressed)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <span aria-hidden className="relative block h-4 w-6">
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H, width: isOpen ? undefined : topWidth }}
          initial={false}
          animate={isOpen ? { width: 17, top: 7.5, rotate: 45 } : { top: 4, rotate: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H, width: isOpen ? undefined : bottomWidth }}
          initial={false}
          animate={isOpen ? { width: 17, top: 7.5, rotate: -45 } : { top: 10, rotate: 0 }}
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
