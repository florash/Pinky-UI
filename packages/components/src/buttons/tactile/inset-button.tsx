"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "./internal";

export type InsetButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  icon?: ReactNode;
};

/**
 * Construction: a surface recessed into the panel it lives on. Inner shadow at
 * rest, no outer shadow at all.
 *
 * Motion signature — **surface toward flush, then deeper**. Every other button
 * in the family starts on or above the plane; this one starts below it, which
 * inverts the whole interaction. Hover brings it *up* toward flush with its
 * parent — the recess shallows — and press pushes it decisively back down past
 * where it began.
 *
 * Because it starts below the plane it needs no shadow to read as dimensional,
 * which is what makes it right for toolbars and player chrome, where a raised
 * button on every control would turn the surface into a rash of bumps.
 */
export const InsetButton = forwardRef<HTMLButtonElement, InsetButtonProps>(function InsetButton(
  { children, icon, className, disabled, type = "button", ...props },
  ref,
) {
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled });

  // Rises toward flush on hover, sinks below rest on press.
  const y = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
    (hover ?? 0) * -1.5 + (pressed ?? 0) * 3,
  );
  // The recess itself shallows as the surface comes up.
  const recess = useTransform(engagement.value, [0, 1], [1, 0.45]);
  const recessShadow = useTransform(
    [recess, press.pressed],
    ([depth, pressed]: number[]) =>
      `inset 0 ${1.5 * (depth ?? 1) + (pressed ?? 0) * 1.5}px ${3 * (depth ?? 1) + (pressed ?? 0) * 3}px rgba(70,90,120,${0.14 * (depth ?? 1) + (pressed ?? 0) * 0.08})`,
  );

  return (
    <span className="inline-flex rounded-pill bg-cloud-50 p-1.5 [box-shadow:var(--edge-light)]">
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y, boxShadow: recessShadow }}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-pill bg-[color-mix(in_oklab,var(--color-cloud-100)_70%,white)] px-5 text-sm font-medium text-ink-900",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        {icon ? (
          <span aria-hidden className="grid place-items-center">
            {icon}
          </span>
        ) : null}
        {children}
      </motion.button>
    </span>
  );
});
