"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: an outer plate with a **recessed chamber** machined into it.
 * The lines live at the bottom of the recess, not on the face.
 *
 * Motion signature — **opposing depths**. Hover lifts the outer plate while the
 * chamber holds its position, so the recess visibly deepens rather than the
 * whole control rising as one piece. Press drives the plate back down onto the
 * chamber and the recess flattens out.
 *
 * Open resolves to **minus + dot** rather than a cross: the upper line stays as
 * a bar and the lower contracts to a point. In a recess a diagonal reads badly
 * — it fights the chamber's own edges — so this one keeps its close mark
 * orthogonal.
 */
export const InsetMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function InsetMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  const plateY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) * -2.5 + (pressed ?? 0) * 3.5,
  );
  // The chamber lags the plate, which is what makes the recess appear to deepen.
  const chamberY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) * 0.5 + (pressed ?? 0) * 1.5,
  );
  const recess = useTransform(
    [engagement.value, press.pressed],
    ([hover, pressed]: number[]) =>
      `inset 0 ${1.5 + (hover ?? 0) * 1.2 + (pressed ?? 0) * 1.5}px ${3 + (hover ?? 0) * 2 + (pressed ?? 0) * 2}px rgba(70,90,120,${0.15 + (hover ?? 0) * 0.05 + (pressed ?? 0) * 0.06})`,
  );

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y: plateY }}
      className={cn(
        "relative grid size-12 place-items-center rounded-[14px] border border-[color:var(--color-line)] bg-[color-mix(in_oklab,white_82%,var(--color-cloud-50))] p-2",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
    >
      <motion.span
        aria-hidden
        style={{ y: chamberY, boxShadow: recess }}
        className="relative grid size-8 place-items-center rounded-[9px] bg-cloud-50"
      >
        <span className="relative block h-4 w-5">
          <motion.span
            className="absolute left-0 block rounded-pill bg-ink-900"
            style={{ height: LINE_H }}
            initial={false}
            animate={isOpen ? { width: 20, top: 7 } : { width: 20, top: 3 }}
            transition={spring}
          />
          <motion.span
            className="absolute block rounded-pill bg-ink-900"
            style={{ height: LINE_H }}
            initial={false}
            animate={
              isOpen
                ? { width: LINE_H * 2, left: 9, top: 12.5, borderRadius: 99 }
                : { width: 12, left: 0, top: 10, borderRadius: 99 }
            }
            transition={spring}
          />
        </span>
      </motion.span>
    </motion.button>
  );
});
