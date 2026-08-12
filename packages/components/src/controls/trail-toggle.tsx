"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { forwardRef, useRef, useState, type ReactNode } from "react";

import { cn } from "../utils/cn";
import { DISABLED } from "../buttons/tactile/internal";

export type TrailToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: ReactNode;
  labelHidden?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Construction: a colourless track where the gradient exists only as a **comet
 * tail behind the moving thumb** — it is drawn between the thumb's old and new
 * positions, then evaporates from the tail forward.
 *
 * Motion signature — **a wake, not a fill**. The gradient is anchored to the
 * thumb's travel rather than to the track or to the touch point, so it is the
 * only one of the three whose colour has a *direction*: left-to-right turning
 * on, right-to-left turning off.
 *
 * No colour at rest. State is position plus a real `role="switch"` checkbox.
 */
export const TrailToggle = forwardRef<HTMLInputElement, TrailToggleProps>(function TrailToggle(
  { checked, defaultChecked = false, onCheckedChange, label, labelHidden, disabled, className },
  ref,
) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;
  const [pulse, setPulse] = useState<number | null>(null);
  const nextPulse = useRef(0);
  const motionEnabled = useMotionEnabled();

  const set = (next: boolean) => {
    // Self-erasing: the bloom unmounts when it is finished, so "no colour at
    // rest" is structurally true and not merely an opacity of zero.
    const id = nextPulse.current++;
    setPulse(id);
    window.setTimeout(() => setPulse((current) => (current === id ? null : current)), 700);
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  // The wake points against the direction of travel.
  const tail = isOn
    ? "linear-gradient(90deg, transparent, var(--color-cloud-300) 45%, var(--color-blush-300))"
    : "linear-gradient(270deg, transparent, var(--color-cloud-300) 45%, var(--color-blush-300))";

  return (
    <label className={cn("inline-flex items-center gap-3", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer", className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        onChange={(event) => set(event.currentTarget.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative block h-8 w-[58px] shrink-0 overflow-hidden rounded-pill border border-[color:var(--color-line)] [box-shadow:var(--depth-inset)]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-[color:var(--color-ink-900)]",
          DISABLED,
        )}
      >
        {motionEnabled && pulse !== null ? (
          <motion.span
            key={pulse}
            className="pointer-events-none absolute inset-y-1.5 rounded-pill"
            style={{ background: tail, left: 4, right: 4, originX: isOn ? 0 : 1 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0.85, 0], scaleX: [0, 1, 1] }}
            transition={{ duration: 0.58, times: [0, 0.4, 1], ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
        <motion.span
          className="absolute top-1/2 block size-6 rounded-full bg-white [box-shadow:var(--depth-raised-md),var(--edge-light)]"
          style={{ marginTop: -12 }}
          initial={false}
          animate={{ left: isOn ? 28 : 4 }}
          transition={motionEnabled ? { type: "spring", ...springs.responsive } : { duration: 0 }}
        />
      </span>
      <span className={cn("text-sm text-ink-900", labelHidden && "sr-only")}>{label}</span>
    </label>
  );
});
