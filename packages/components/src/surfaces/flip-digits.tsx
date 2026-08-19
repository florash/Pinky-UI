"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";

import { cn } from "../utils/cn";

export type FlipDigitsProps = {
  value: number | string;
  padTo?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const SIZE: Record<NonNullable<FlipDigitsProps["size"]>, { height: number; text: string }> = {
  sm: { height: 28, text: "text-xl" },
  md: { height: 40, text: "text-3xl" },
  lg: { height: 56, text: "text-5xl" },
};

const DIGITS = Array.from({ length: 10 }, (_, digit) => digit);

function DigitColumn({ digit, height }: { digit: number; height: number }) {
  const motionEnabled = useMotionEnabled();
  return (
    <span className="relative inline-block overflow-hidden" style={{ height, width: "0.62em" }}>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        animate={{ y: -digit * height }}
        transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
      >
        {DIGITS.map((glyph) => (
          <span key={glyph} style={{ height }} className="flex items-center justify-center">
            {glyph}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * A departures-board digit roll: each digit gets its own vertical column of
 * 0–9 that lands on the new value with a snappy spring, instead of the whole
 * number cross-fading or easing like Animated Number does — a different,
 * more theatrical motion signature for countdowns and stat reveals, not a
 * replacement for it. Non-digit characters (":", ",", "+") pass through as
 * static separators between rolling columns.
 *
 * The rolling strip is `aria-hidden`; a single sr-only span carries the
 * settled value so assistive tech never has to parse ten stacked digits
 * per column.
 */
export function FlipDigits({ value, padTo, size = "md", label, className }: FlipDigitsProps) {
  const raw = typeof value === "number" ? String(Math.max(0, Math.trunc(value))) : value;
  const text = padTo && typeof value === "number" ? raw.padStart(padTo, "0") : raw;
  const { height, text: sizeText } = SIZE[size];
  const announced = label ? `${label}: ${raw}` : raw;

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span aria-hidden className={cn("inline-flex items-center gap-[0.08em] font-display font-semibold tabular-nums text-ink-900", sizeText)}>
        {[...text].map((char, index) =>
          /[0-9]/.test(char) ? (
            <DigitColumn key={index} digit={Number(char)} height={height} />
          ) : (
            <span key={index} className="px-0.5 text-ink-500">
              {char}
            </span>
          ),
        )}
      </span>
      <span className="sr-only">{announced}</span>
    </span>
  );
}
