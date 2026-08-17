"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { CONTROL_PX, DISABLED, FOCUS_RING, useEngagement, type ControlSize } from "./internal";

export type HairlineChamberProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  icon: ReactNode;
  "aria-label": string;
  size?: ControlSize;
};

/**
 * Construction: a rounded-square plate with a smaller **recessed chamber**
 * machined into its face; the glyph sits at the bottom of the recess.
 *
 * Deliberately not a squared-off Hairline Circle. Motion signature —
 * **opposing surfaces**: the outer plate lifts on hover while the chamber holds
 * position, so the recess visibly deepens rather than the control rising as one
 * piece. Press drives the plate down onto the chamber until the recess reads
 * flat. It is the only button in the family where two surfaces move against
 * each other, which is what gives it the machined, architectural feel a plain
 * square never has.
 */
export const HairlineChamber = forwardRef<HTMLButtonElement, HairlineChamberProps>(
  function HairlineChamber({ icon, size = "md", className, disabled, type = "button", ...props }, ref) {
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });

    const plateY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * -2.5 + (pressed ?? 0) * 3.5,
    );
    // The chamber lags — that difference is the deepening recess.
    const chamberY = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * 0.6 + (pressed ?? 0) * 1.8,
    );
    const recess = useTransform(
      [engagement.value, press.pressed],
      ([hover, pressed]: number[]) =>
        `inset 0 ${1.4 + (hover ?? 0) * 1.2 + (pressed ?? 0) * 1.4}px ${3 + (hover ?? 0) * 2 + (pressed ?? 0) * 2}px rgba(70,90,120,${0.14 + (hover ?? 0) * 0.05 + (pressed ?? 0) * 0.06})`,
    );
    const px = CONTROL_PX[size];

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        style={{ y: plateY, width: px, height: px }}
        className={cn(
          "grid place-items-center rounded-[13px] border border-[color:var(--color-line)] bg-[color-mix(in_oklab,white_88%,var(--color-cloud-50))] p-2",
          "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
          "hover:border-[color:var(--color-line-strong)] focus-visible:border-[color:var(--color-line-strong)]",
          "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        <motion.span
          aria-hidden
          style={{ y: chamberY, boxShadow: recess }}
          className="grid size-full place-items-center rounded-[8px] bg-cloud-50 text-ink-900"
        >
          {icon}
        </motion.span>
      </motion.button>
    );
  },
);
