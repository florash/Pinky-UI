"use client";

import { elasticSpring, useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, useRef, useState, type ReactNode } from "react";

import { cn } from "../utils/cn";
import { DISABLED } from "../buttons/tactile/internal";

/** The gradient. It only ever exists mid-transition. */
const BLOOM =
  "linear-gradient(100deg, var(--color-blush-200), var(--color-blush-300) 38%, var(--color-cloud-300) 78%, var(--color-cloud-200))";

export type LiquidToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: ReactNode;
  labelHidden?: boolean;
  /** 0 = calm settle, 1 = visible liquid overshoot. */
  fluidity?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Construction: a **colourless** inset track — no fill in either state, just a
 * recess and a white thumb. The gradient is not what "on" looks like; it is
 * what *changing* looks like.
 *
 * Motion signature — **the gradient is the transition**. Flipping the switch
 * wipes a blush→cloud bloom across the track behind the travelling thumb, and
 * it dissipates the moment the thumb lands. At rest there is no colour at all,
 * so a form full of these stays quiet and the one you just touched is the only
 * thing that flared.
 *
 * State is carried by thumb position and a real `role="switch"` checkbox, never
 * by the gradient — which matters precisely because the gradient is gone a
 * few hundred milliseconds later. Under reduced motion the bloom does not run;
 * the thumb still moves, because a switch that stops showing its state is not
 * an accessible switch.
 */
export const LiquidToggle = forwardRef<HTMLInputElement, LiquidToggleProps>(function LiquidToggle(
  { checked, defaultChecked = false, onCheckedChange, label, labelHidden, fluidity = 0.6, disabled, className },
  ref,
) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;
  const [pulse, setPulse] = useState<number | null>(null);
  const nextPulse = useRef(0);
  const direction = useRef(1);
  const motionEnabled = useMotionEnabled();
  const press = usePressSpring({ scale: 1, disabled });

  const set = (next: boolean) => {
    direction.current = next ? 1 : -1;
    // Self-erasing: the bloom unmounts when it is finished, so "no colour at
    // rest" is structurally true and not merely an opacity of zero.
    const id = nextPulse.current++;
    setPulse(id);
    window.setTimeout(() => setPulse((current) => (current === id ? null : current)), 740);
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  const spring = motionEnabled
    ? { type: "spring" as const, ...elasticSpring(Math.min(Math.max(fluidity, 0), 1)) }
    : { duration: 0 };

  // Elongates while travelling, rounds when it lands — the liquid tell.
  const squash = useTransform(press.pressed, (v) => 1 + v * 0.2 * fluidity);

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        className,
      )}
    >
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
          "relative block h-8 w-[58px] shrink-0 overflow-hidden rounded-pill",
          // No fill in either state. The recess and the hairline are the whole surface.
          "border border-[color:var(--color-line)] [box-shadow:var(--depth-inset)]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-[color:var(--color-ink-900)]",
          DISABLED,
        )}
      >
        {/* The bloom. Keyed on `pulse` so each flip mounts a fresh, self-erasing pass. */}
        {motionEnabled && pulse !== null ? (
          <motion.span
            key={pulse}
            className="absolute inset-0 rounded-pill"
            style={{ background: BLOOM }}
            initial={{ opacity: 0, scaleX: 0.2, originX: direction.current > 0 ? 0 : 1 }}
            animate={{ opacity: [0, 0.95, 0], scaleX: [0.2, 1, 1] }}
            transition={{ duration: 0.62, times: [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        {/* Position is the state. It survives when the colour has gone. */}
        <motion.span
          className="absolute top-1/2 block h-6 rounded-pill bg-white [box-shadow:var(--depth-raised-md),var(--edge-light)]"
          style={{ scaleX: squash, marginTop: -12 }}
          initial={false}
          animate={{ left: isOn ? 28 : 4, width: 24 }}
          transition={spring}
        />
      </span>

      <span className={cn("text-sm text-ink-900", labelHidden && "sr-only")}>{label}</span>
    </label>
  );
});
