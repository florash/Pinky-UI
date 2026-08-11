"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "../utils/cn";

export type ElasticToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible text label. Omit only if `aria-label` is supplied. */
  label?: string;
  /** How much the thumb stretches while travelling, 0–1. */
  stretch?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/**
 * A switch whose thumb stretches as it travels and settles on a spring.
 *
 * The stretch is decoration on top of a real switch: `role="switch"` with
 * `aria-checked`, operable with Space and Enter, and the on/off states are
 * distinguished by position and colour rather than by the animation.
 */
export function ElasticToggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  stretch = 0.5,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: ElasticToggleProps) {
  const labelId = useId();
  const motionEnabled = useMotionEnabled();
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = checked ?? internal;
  const [travelling, setTravelling] = useState(false);

  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!isChecked);
    onCheckedChange?.(!isChecked);

    if (!motionEnabled) return;
    setTravelling(true);
    setTimeout(() => setTravelling(false), 160);
  };

  const scaleX = travelling ? 1 + 0.35 * stretch : 1;
  const scaleY = travelling ? 1 - 0.12 * stretch : 1;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill px-1",
          "transition-colors duration-300 ease-[var(--ease-soft)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-ink-900" : "bg-line-strong",
        )}
      >
        <motion.span
          aria-hidden
          className="block size-5 rounded-pill bg-white shadow-soft"
          animate={{ x: isChecked ? 20 : 0, scaleX, scaleY }}
          transition={
            motionEnabled ? { type: "spring", ...springs.elastic } : { duration: 0 }
          }
        />
      </button>

      {label ? (
        <label
          id={labelId}
          onClick={toggle}
          className={cn("cursor-pointer text-sm text-ink-700 select-none", disabled && "opacity-50")}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
}
