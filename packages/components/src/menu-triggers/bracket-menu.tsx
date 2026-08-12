"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

const CORNERS = [
  { key: "tl", cls: "top-0 left-0 border-t border-l rounded-tl-[4px]", x: 1, y: 1 },
  { key: "tr", cls: "top-0 right-0 border-t border-r rounded-tr-[4px]", x: -1, y: 1 },
  { key: "bl", cls: "bottom-0 left-0 border-b border-l rounded-bl-[4px]", x: 1, y: -1 },
  { key: "br", cls: "bottom-0 right-0 border-b border-r rounded-br-[4px]", x: -1, y: -1 },
] as const;

/**
 * Construction: **no button chrome at all** — no fill, no border, no shadow.
 * Four hairline corner brackets imply the frame, and the lines sit inside it.
 *
 * Motion signature — **convergence**. Hover pulls all four brackets inward
 * toward the centre and shortens the lower line to meet them, so the control
 * tightens rather than lifting. Nothing here uses depth: this is the one
 * trigger in the set that is purely a drawing, which makes it the right choice
 * over editorial imagery or a photograph where a solid button would sit badly.
 *
 * Open re-composes brackets and lines together: the brackets spread back out
 * and the lines cross inside them, so the close mark is *framed* rather than
 * floating.
 */
export const BracketMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function BracketMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement("soft");
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  // Converge on hover; press snaps them tight; open lets them back out.
  const converge = useTransform(
    [engagement.value, press.pressed],
    ([hover, pressed]: number[]) => (hover ?? 0) * 2.5 + (pressed ?? 0) * 1.5,
  );

  // Precomputed per corner: hooks cannot be called inside the render loop below.
  const inward = useTransform(converge, (v) => v);
  const outward = useTransform(converge, (v) => -v);
  const offset = { 1: inward, "-1": outward } as const;

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn("relative grid size-12 place-items-center rounded-[6px]", FOCUS_RING, DISABLED, className)}
      {...engagement.handlers}
      {...press.handlers}
    >
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.key}
          aria-hidden
          style={{ x: offset[corner.x], y: offset[corner.y] }}
          className={cn(
            "absolute size-2.5 border-[color:var(--color-line-strong)]",
            corner.cls,
          )}
        />
      ))}

      <span aria-hidden className="relative block h-4 w-5">
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 19, top: 7.5, rotate: 45 } : { width: 20, top: 3, rotate: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 19, top: 7.5, rotate: -45 } : { width: 14, top: 10, rotate: 0 }}
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
