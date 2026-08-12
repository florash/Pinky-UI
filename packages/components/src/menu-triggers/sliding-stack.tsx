"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: a wide soft rectangle whose two lines sit on different planes —
 * the upper line is opaque ink, the lower is set back and lighter, with a third
 * ghost line behind it implying a stack seen slightly from the front.
 *
 * Motion signature — **counter-slide in place**. Hover slides the upper line
 * right and the lower line left without either changing length, so the stack
 * shears rather than lifting. Open resolves to **two parallel diagonals** — the
 * lines rotate together and never cross, which keeps the shear idea intact
 * instead of collapsing into the usual X.
 */
export const SlidingStack = forwardRef<HTMLButtonElement, MenuTriggerBase>(function SlidingStack(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  const shear = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    Math.max(0, (hover ?? 0) - (pressed ?? 0)),
  );
  const topX = useTransform(shear, (v) => v * 4);
  const bottomX = useTransform(shear, (v) => v * -4);
  const ghostX = useTransform(shear, (v) => v * -6);
  const surfaceY = useTransform(press.pressed, (v) => v * 2);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y: surfaceY }}
      className={cn(
        "relative grid h-12 w-[68px] place-items-center rounded-[13px] border border-[color:var(--color-line)] bg-white",
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
      <span aria-hidden className="relative block h-4 w-7">
        {/* Ghost plane — furthest back. */}
        <motion.span
          className="absolute left-0 block rounded-pill bg-cloud-300"
          style={{ height: LINE_H, x: ghostX }}
          initial={false}
          animate={isOpen ? { width: 26, top: 12, rotate: -20, opacity: 0 } : { width: 16, top: 12, rotate: 0, opacity: 1 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H, x: topX }}
          initial={false}
          animate={isOpen ? { width: 26, top: 4, rotate: -20 } : { width: 28, top: 3, rotate: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-[color-mix(in_oklab,var(--color-ink-900)_55%,white)]"
          style={{ height: LINE_H, x: bottomX }}
          initial={false}
          animate={isOpen ? { width: 26, top: 11, rotate: -20 } : { width: 20, top: 8, rotate: 0 }}
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
