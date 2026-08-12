"use client";

import { usePressSpring, useProximityItem } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { CONTROL_PX, DISABLED, FOCUS_RING, useEngagement, type ControlSize } from "./internal";

export type DoubleRingButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  icon?: ReactNode;
  "aria-label": string;
  size?: ControlSize;
};

/**
 * Construction: two concentric hairlines. An outer ring that reacts, an inner
 * disc that stays quiet.
 *
 * Motion signature — **response to approach**. Every other button in the family
 * waits for contact; this one begins answering while the pointer is still on
 * its way. The outer ring widens and gains contrast as you near it, and the
 * inner surface deliberately does not move — the stillness at the centre is
 * what makes the outer movement legible.
 *
 * Proximity is a pure enhancement. It comes from {@link useProximityItem},
 * which returns a flat 0 outside a `Proximity` provider, on coarse pointers and
 * under reduced motion — so the ring is driven by `max(proximity, hover/focus)`
 * and the control is complete for touch and keyboard on its own. Wrapping it in
 * a provider only makes the response begin earlier.
 *
 * The geometry deliberately rhymes with the Ring Cursor, so pointer and control
 * read as the same material.
 */
export const DoubleRingButton = forwardRef<HTMLButtonElement, DoubleRingButtonProps>(
  function DoubleRingButton(
    { icon, size = "lg", className, disabled, type = "button", ...props },
    ref,
  ) {
    const { ref: proximityRef, proximity } = useProximityItem<HTMLButtonElement>();
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });

    // Contact always wins; proximity only gets there first.
    const approach = useTransform([proximity, engagement.value], ([near, engaged]: number[]) =>
      Math.max(near ?? 0, engaged ?? 0),
    );
    const ringScale = useTransform([approach, press.pressed], ([near, pressed]: number[]) =>
      1 + (near ?? 0) * 0.08 - (pressed ?? 0) * 0.06,
    );
    const ringOpacity = useTransform(approach, [0, 1], [0.5, 1]);
    const coreScale = useTransform(press.pressed, (value) => 1 - value * 0.05);

    const px = CONTROL_PX[size];

    return (
      <button
        ref={(node) => {
          proximityRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type={type}
        disabled={disabled}
        style={{ width: px, height: px }}
        className={cn("relative inline-grid place-items-center rounded-full", FOCUS_RING, DISABLED, className)}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {/* Outer ring — the only part that answers approach. */}
        <motion.span
          aria-hidden
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute inset-0 rounded-full border border-[color:var(--color-line-strong)]"
        />
        {/* Inner disc — deliberately still. */}
        <motion.span
          aria-hidden
          style={{ scale: coreScale }}
          className="absolute inset-[7px] grid place-items-center rounded-full border border-[color:var(--color-line)] bg-white [box-shadow:var(--depth-raised-sm),var(--edge-light)]"
        />
        <span aria-hidden className="relative grid place-items-center text-ink-900">
          {icon}
        </span>
      </button>
    );
  },
);
