"use client";

import { usePressSpring, useProximityItem } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, LINE_H, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

/**
 * Construction: two lines inside a very fine outer ring, with a quiet inner
 * disc between them.
 *
 * Motion signature — **staged response**. The ring answers first, on approach,
 * and the lines follow only on contact. That lag is the whole idea: the control
 * acknowledges you before you arrive, then commits when you do.
 *
 * Proximity is a pure enhancement. {@link useProximityItem} returns a flat 0
 * outside a `Proximity` provider, on coarse pointers and under reduced motion,
 * so the ring is driven by `max(proximity, hover/focus)` — touch and keyboard
 * get the identical staged response from contact alone, and wrapping the
 * trigger in a provider only makes stage one begin earlier.
 *
 * Open contracts the ring slightly and folds the lines into a single diagonal,
 * so the ring closes in as the mark simplifies.
 */
export const DoubleLineRing = forwardRef<HTMLButtonElement, MenuTriggerBase>(function DoubleLineRing(
  { className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger(base);
  const { ref: proximityRef, proximity } = useProximityItem<HTMLButtonElement>();
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });

  // Contact always wins; proximity only gets there first.
  const approach = useTransform([proximity, engagement.value], ([near, engaged]: number[]) =>
    Math.max(near ?? 0, engaged ?? 0),
  );
  const ringScale = useTransform([approach, press.pressed], ([near, pressed]: number[]) =>
    1 + (near ?? 0) * 0.07 - (pressed ?? 0) * 0.05 - (isOpen ? 0.04 : 0),
  );
  const ringOpacity = useTransform(approach, [0, 1], [0.45, 1]);
  const coreScale = useTransform(press.pressed, (v) => 1 - v * 0.06);

  return (
    <button
      ref={(node) => {
        proximityRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      {...buttonProps}
      className={cn("relative grid size-14 place-items-center rounded-full", FOCUS_RING, DISABLED, className)}
      {...engagement.handlers}
      {...press.handlers}
    >
      <motion.span
        aria-hidden
        style={{ scale: ringScale, opacity: ringOpacity }}
        className="absolute inset-0 rounded-full border border-[color:var(--color-line-strong)]"
      />
      <motion.span
        aria-hidden
        style={{ scale: coreScale }}
        className="absolute inset-[6px] rounded-full border border-[color:var(--color-line)] bg-white [box-shadow:var(--depth-raised-sm),var(--edge-light)]"
      />
      <span aria-hidden className="relative block h-4 w-[18px]">
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 18, top: 7.5, rotate: 45 } : { width: 18, top: 4, rotate: 0 }}
          transition={spring}
        />
        <motion.span
          className="absolute left-0 block rounded-pill bg-ink-900"
          style={{ height: LINE_H }}
          initial={false}
          animate={isOpen ? { width: 18, top: 7.5, rotate: 45, opacity: 0 } : { width: 11, top: 10, rotate: 0, opacity: 1 }}
          transition={spring}
        />
      </span>
    </button>
  );
});
