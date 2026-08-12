"use client";

import { springs, usePressSpring } from "@pinky/primitives";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { forwardRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: a compact square that grows into a pill and reveals a word.
 *
 * Motion signature — **change of silhouette, with the word travelling in**.
 * Alone in this set the button's own footprint changes: square at rest, pill
 * when engaged. The label does not fade in — it slides in from behind the lines
 * under a clip, so the word arrives from inside the control rather than being
 * cross-faded on top of it, which is what usually makes an expanding CTA look
 * cheap.
 *
 * Open swaps the word to "Close" and collapses the two lines into a single
 * short bar: the mark stops being a menu without becoming a cross, because at
 * this width a diagonal would sit oddly beside text.
 */
export const ExpandableMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function ExpandableMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring, motionEnabled } = useMenuTrigger(base);
  const [engaged, setEngaged] = useState(false);
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const scaleX = useTransform(press.pressed, (v) => 1 - v * 0.025);

  const showLabel = engaged || isOpen;

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      style={{ scaleX }}
      className={cn(
        "relative flex h-12 items-center overflow-hidden rounded-[14px] border border-[color:var(--color-line)] bg-white pl-3.5",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "hover:border-[color:var(--color-line-strong)] focus-visible:border-[color:var(--color-line-strong)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      onPointerEnter={(event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerType !== "touch") setEngaged(true);
      }}
      onPointerLeave={() => {
        setEngaged(false);
        press.handlers.onPointerLeave();
      }}
      onFocus={() => setEngaged(true)}
      onBlur={() => {
        setEngaged(false);
        press.handlers.onBlur();
      }}
      onPointerDown={press.handlers.onPointerDown}
      onPointerUp={press.handlers.onPointerUp}
      onPointerCancel={press.handlers.onPointerCancel}
      onKeyDown={press.handlers.onKeyDown}
      onKeyUp={press.handlers.onKeyUp}
    >
      <span aria-hidden className="relative block h-4 w-5 shrink-0">
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 14, top: 7.5 } : { width: 20, top: 4 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 14, top: 7.5, opacity: 0 } : { width: 13, top: 10, opacity: 1 }}
          transition={spring}
        />
      </span>

      <motion.span
        className="overflow-hidden whitespace-nowrap"
        initial={false}
        animate={{ width: showLabel ? "auto" : 0 }}
        transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isOpen ? "close" : "menu"}
            className="block pr-4 pl-2.5 text-sm font-medium text-ink-900"
            initial={motionEnabled ? { x: -10, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={motionEnabled ? { x: 10, opacity: 0 } : { opacity: 0 }}
            transition={spring}
          >
            {isOpen ? "Close" : "Menu"}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
});
