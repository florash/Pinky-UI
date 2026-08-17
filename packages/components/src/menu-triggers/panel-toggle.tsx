"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: a rounded rectangle outline with one filled rail down its left
 * edge — the sidebar-toggle lineage (VS Code, Linear, Notion). It is a tiny
 * diagram of the layout it controls, not an abstract mark, which is why it
 * reads instantly in an app chrome where a hamburger would be ambiguous.
 *
 * Motion signature — **the rail redraws the layout**. Hover widens the rail by
 * a pixel and nothing else moves. Open slides the rail across to the right edge
 * and lightens the frame: the icon shows you the panel's new side rather than
 * turning into a cross. Alone in this set the open state is still a picture of
 * a layout, because that is the semantic the control actually carries.
 */
export const PanelToggle = forwardRef<HTMLButtonElement, MenuTriggerBase>(function PanelToggle(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const railWidth = useTransform(engagement.value, [0, 1], [6, 7.5]);
  const y = useTransform(press.pressed, (v) => v * 2);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ y }}
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
      <span
        aria-hidden
        className="relative block h-[18px] w-[22px] overflow-hidden rounded-[4px] border border-[color:var(--color-ink-900)]"
      >
        <motion.span
          className="absolute inset-y-0 block bg-ink-900"
          style={{ width: railWidth }}
          initial={false}
          animate={{ left: isOpen ? "auto" : 0, right: isOpen ? 0 : "auto" }}
          transition={spring}
        />
      </span>
    </motion.button>
  );
});
