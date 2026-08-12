"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: two lines that float *above* a soft surface rather than being
 * drawn on it — each line carries its own shadow, so the plate reads as a base
 * and the lines as objects resting on it.
 *
 * Motion signature — **depth separation, then offset cross**. Hover lifts the
 * upper line further than the lower one and deepens only its shadow, so the two
 * lines visibly occupy different heights. Open slides them past each other and
 * crosses them *off-centre*: the intersection sits left of the middle, which
 * reads as a close mark without being the usual symmetrical X.
 */
export const FloatingLines = forwardRef<HTMLButtonElement, MenuTriggerBase>(function FloatingLines(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  const plateY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) * -2 + (pressed ?? 0) * 2.5,
  );
  // The upper line leaves the plate further than the lower one.
  const topFloat = useTransform(engagement.value, [0, 1], [0, -2.5]);
  const bottomFloat = useTransform(engagement.value, [0, 1], [0, -1]);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y: plateY }}
      className={cn(
        "relative grid size-12 place-items-center rounded-[14px] border border-[color:var(--color-line)] bg-white",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "hover:border-[color:var(--color-line-strong)] focus-visible:border-[color:var(--color-line-strong)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <span aria-hidden className="relative block size-5">
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H, y: topFloat }}
          initial={false}
          animate={
            isOpen
              ? { width: 22, top: 9, x: -3, rotate: 32, filter: "drop-shadow(0 1px 1px rgba(70,90,120,.35))" }
              : { width: 20, top: 5, x: 0, rotate: 0, filter: "drop-shadow(0 1px 1px rgba(70,90,120,.28))" }
          }
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H, y: bottomFloat }}
          initial={false}
          animate={
            isOpen
              ? { width: 22, top: 9, x: -3, rotate: -32, filter: "drop-shadow(0 1px 1px rgba(70,90,120,.2))" }
              : { width: 13, top: 13, x: 0, rotate: 0, filter: "drop-shadow(0 1px 1px rgba(70,90,120,.16))" }
          }
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
