"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: **no icon at all** — the word itself, over a hairline rule.
 * The typographic lineage used by fashion and editorial sites, where an icon
 * would read as generic app chrome.
 *
 * Motion signature — **the rule draws, the word swaps by travel**. Hover draws
 * the underline in from the leading edge; open exchanges MENU for CLOSE by
 * sliding one out and the other in under a clip, never crossfading. Letter
 * spacing tightens a fraction on press, which is the only compression a purely
 * typographic control can offer.
 *
 * Since it carries no mark, the label is doing all the work — so it stays
 * uppercase and tracked, and the accessible name is the visible word.
 */
export const TextMenu = forwardRef<HTMLButtonElement, MenuTriggerBase>(function TextMenu(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const tracking = useTransform(press.pressed, (v) => `${0.18 - v * 0.05}em`);
  const rule = useTransform(engagement.value, [0, 1], [0, 1]);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn("relative inline-block pb-1.5", FOCUS_RING, DISABLED, className)}
      {...engagement.handlers}
      {...press.handlers}
    >
      <span className="relative block h-4 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isOpen ? "close" : "menu"}
            className="block font-mono text-[0.6875rem] whitespace-nowrap text-ink-900 uppercase"
            style={{ letterSpacing: tracking }}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={spring}
          >
            {isOpen ? "Close" : "Menu"}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 block h-px origin-left bg-ink-900"
        style={{ scaleX: rule }}
      />
    </motion.button>
  );
});
