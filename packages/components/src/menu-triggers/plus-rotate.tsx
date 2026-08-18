"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: a `+` of two crossed strokes — the create/disclose lineage
 * (Notion, Linear). Two lines, but crossed rather than stacked, which makes it
 * a different mark entirely: a plus reads as *add* or *reveal*, never as
 * navigation.
 *
 * Motion signature — **arms extend, then the whole mark turns**. Hover grows
 * both strokes outward from the centre a pixel at each end, so the plus reaches
 * rather than lifts. Open rotates the pair 45° into an ×. This is the one case
 * where a rotation is the honest answer: `+` and `×` are the same glyph at two
 * angles, so the transform *is* the semantic.
 */
export const PlusRotate = forwardRef<HTMLButtonElement, MenuTriggerBase>(function PlusRotate(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger({ ...base, label: base.label ?? "Open menu" });
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const reach = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    18 + Math.max(0, (h ?? 0) - (p ?? 0) * 1.6) * 3,
  );

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn(
        "relative grid size-12 place-items-center rounded-full border border-[color:var(--color-line)] bg-white",
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
        className="relative grid size-5 place-items-center"
        initial={false}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={spring}
      >
        <motion.span
          className="absolute block rounded-pill bg-ink-900"
          style={{ height: LINE_H, width: reach }}
        />
        <motion.span
          className="absolute block rounded-pill bg-ink-900"
          style={{ width: LINE_H, height: reach }}
        />
      </motion.span>
    </motion.button>
  );
});
