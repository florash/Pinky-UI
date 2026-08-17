"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { cn } from "../internal/cn";

export type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, locale, duration = 500, className }: AnimatedNumberProps) {
  const visual = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const motionEnabled = useMotionEnabled();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }), [decimals, locale]);
  const format = useCallback((number: number) => `${prefix}${formatter.format(number)}${suffix}`, [formatter, prefix, suffix]);
  useEffect(() => {
    const node = visual.current;
    if (!node) return;
    const startValue = previous.current;
    previous.current = value;
    if (!motionEnabled || duration <= 0) { node.textContent = format(value); return; }
    const started = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = format(startValue + (value - startValue) * eased);
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [duration, format, motionEnabled, value]);
  const final = format(value);
  return <span className={cn("tabular-nums", className)}><span ref={visual} aria-hidden>{final}</span><span className="sr-only">{final}</span></span>;
}
