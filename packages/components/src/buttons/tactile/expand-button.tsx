"use client";

import { springs, useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { cn } from "../../utils/cn";
import { CONTROL_PX, DISABLED, FOCUS_RING, type ControlSize } from "./internal";

export type ExpandButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  icon: ReactNode;
  /** Revealed on hover and focus. Always in the DOM for assistive technology. */
  label: string;
  size?: ControlSize;
};

/**
 * Construction: a disc whose label sits in a clipped span beside the glyph,
 * collapsed to zero width at rest.
 *
 * Motion signature — **change of silhouette**. This is the only button in the
 * family whose shape class changes: circle at rest, pill when engaged. Nothing
 * lifts and nothing layers; the geometry itself is the whole response.
 *
 * The label is in the DOM at all times, so the accessible name never depends on
 * hover — the clip is purely visual. Under reduced motion the width still
 * changes, it simply arrives instantly: users who asked for less movement did
 * not ask for less information.
 */
export const ExpandButton = forwardRef<HTMLButtonElement, ExpandButtonProps>(function ExpandButton(
  { icon, label, size = "md", className, disabled, type = "button", ...props },
  ref,
) {
  const [engaged, setEngaged] = useState(false);
  const motionEnabled = useMotionEnabled();
  const press = usePressSpring({ scale: 1, disabled });

  const px = CONTROL_PX[size];
  // A pill compresses along its length rather than sinking.
  const scaleX = useTransform(press.pressed, (value) => 1 - value * 0.03);

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ scaleX, height: px, minWidth: px }}
      className={cn(
        "group relative inline-flex items-center overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-white text-sm font-medium text-ink-900",
        "hover:border-[color:var(--color-line-strong)] focus-visible:border-[color:var(--color-line-strong)]",
        "[box-shadow:var(--depth-raised-sm)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...press.handlers}
      onPointerEnter={(event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerType !== "touch") setEngaged(true);
      }}
      // Composed rather than replaced: press.handlers also releases on leave and
      // blur, and dropping those would strand the button in a pressed state.
      onPointerLeave={() => {
        setEngaged(false);
        press.handlers.onPointerLeave();
      }}
      onFocus={() => setEngaged(true)}
      onBlur={() => {
        setEngaged(false);
        press.handlers.onBlur();
      }}
      {...props}
    >
      <span aria-hidden className="grid shrink-0 place-items-center" style={{ width: px, height: px }}>
        {icon}
      </span>
      <motion.span
        className="overflow-hidden whitespace-nowrap"
        initial={false}
        animate={{ width: engaged ? "auto" : 0 }}
        transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
      >
        <span className="block pr-5">{label}</span>
      </motion.span>
    </motion.button>
  );
});
