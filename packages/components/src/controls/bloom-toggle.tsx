"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../utils/cn";
import { DISABLED } from "../buttons/tactile/internal";

const BLOOM =
  "radial-gradient(circle, var(--color-blush-300), var(--color-blush-200) 40%, var(--color-cloud-300) 72%, transparent 78%)";

export type BloomToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: ReactNode;
  labelHidden?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Construction: a colourless track whose gradient does not travel across it —
 * it **blooms outward from the thumb** and dissolves, the way a like button
 * bursts.
 *
 * Motion signature — **radial burst at the origin**. Where `LiquidToggle`
 * wipes the bloom along the track, this one detonates it in place: a circle of
 * blush scales up from under the thumb, overshoots the track and is gone. The
 * flare marks *where you touched*, not which state you reached.
 *
 * At rest there is no colour whatsoever. State is thumb position plus a real
 * `role="switch"` checkbox.
 */
export const BloomToggle = forwardRef<HTMLInputElement, BloomToggleProps>(function BloomToggle(
  { checked, defaultChecked = false, onCheckedChange, label, labelHidden, disabled, className },
  ref,
) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;
  const [pulse, setPulse] = useState<number | null>(null);
  const nextPulse = useRef(0);
  const pulseTimer = useRef<number | null>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => () => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
  }, []);

  const set = (next: boolean) => {
    // Self-erasing: the bloom unmounts when it is finished, so "no colour at
    // rest" is structurally true and not merely an opacity of zero.
    const id = nextPulse.current++;
    setPulse(id);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => {
      setPulse((current) => (current === id ? null : current));
      pulseTimer.current = null;
    }, 780);
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

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
            className="pointer-events-none absolute top-1/2 block size-8 rounded-full"
            style={{ background: BLOOM, marginTop: -16, left: isOn ? 20 : -4 }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.2, 2.6, 3.2] }}
            transition={{ duration: 0.66, times: [0, 0.34, 1], ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
        <motion.span
          className="absolute top-1/2 left-0 block size-6 rounded-full bg-white [box-shadow:var(--depth-raised-md),var(--edge-light)]"
          style={{ marginTop: -12 }}
          initial={false}
          animate={{ x: isOn ? 28 : 4 }}
          transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
        />
      </span>
      <span className={cn("text-sm text-ink-900", labelHidden && "sr-only")}>{label}</span>
    </label>
  );
});
