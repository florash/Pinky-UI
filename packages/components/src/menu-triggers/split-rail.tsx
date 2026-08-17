"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: not one button face but **two independent rails**, stacked with
 * a visible seam between them. Each rail owns one line.
 *
 * Motion signature — **counter-slide, then recombine**. Hover drives the rails
 * in opposite directions along their own axis, opening the seam; the two halves
 * of the control briefly stop being one object. Open brings them back together
 * and the lines meet at the seam as a compressed cross.
 *
 * This is the only trigger whose *button body* splits. Everything else moves
 * its lines inside a stable shell.
 */
export const SplitRail = forwardRef<HTMLButtonElement, MenuTriggerBase>(function SplitRail(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  // Rails part on hover and are squeezed shut by press.
  const part = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    Math.max(0, (hover ?? 0) - (pressed ?? 0) * 1.5),
  );
  const upperX = useTransform(part, (v) => v * -3);
  const lowerX = useTransform(part, (v) => v * 3);
  const gap = useTransform(part, (v) => 2 + v * 2);

  const rail =
    "relative flex h-[22px] w-12 items-center justify-center rounded-[7px] border border-[color:var(--color-line)] bg-white [box-shadow:var(--depth-raised-sm),var(--edge-light)]";

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-[9px]",
        "transition-[filter] duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <motion.span aria-hidden style={{ x: upperX }} className={rail}>
        <motion.span
          className="block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 18, rotate: 34, y: 5 } : { width: 18, rotate: 0, y: 0 }}
          transition={spring}
        />
      </motion.span>

      <motion.span aria-hidden style={{ height: gap }} className="block w-px" />

      <motion.span aria-hidden style={{ x: lowerX }} className={rail}>
        <motion.span
          className="block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 18, rotate: -34, y: -5 } : { width: 12, rotate: 0, y: 0 }}
          transition={spring}
        />
      </motion.span>
    </motion.button>
  );
});
