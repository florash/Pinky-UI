"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type SplitTextBy = "word" | "character" | "line";

export type SplitTextRevealProps = {
  children: ReactNode;
  by?: SplitTextBy;
  stagger?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/**
 * Splits short display text into stable final-content spans and animates those
 * spans into place. The DOM never contains placeholder glyphs, which keeps
 * SSR, selection and screen-reader output predictable.
 */
export function SplitTextReveal({
  children,
  by = "word",
  stagger = 0.035,
  delay = 0,
  duration = 0.46,
  distance = 16,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: SplitTextRevealProps) {
  const text = textContent(children);
  const ref = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const animate = !motionEnabled || disabled || visible;

  if (text === null) {
    return <span className={className}>{children}</span>;
  }

  const units = splitText(text, by);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {text}
      </span>
      <span aria-hidden="true">
        {units.map((unit, index) => {
          if (unit.whitespace) {
            return <span key={index}>{unit.value}</span>;
          }

          return (
            <motion.span
              key={index}
              style={{ display: by === "line" ? "block" : "inline-block", whiteSpace: "pre" }}
              initial={motionEnabled && !disabled ? { opacity: 0, y: distance } : false}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay + index * stagger : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              {unit.value}
            </motion.span>
          );
        })}
      </span>
    </span>
  );
}

function textContent(value: ReactNode): string | null {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return null;
}

function splitText(text: string, by: SplitTextBy) {
  if (by === "character") {
    return Array.from(text).map((value) => ({ value, whitespace: /^\s$/.test(value) }));
  }

  if (by === "line") {
    return text.split("\n").flatMap((value, index, all) => [
      { value, whitespace: value.length === 0 },
      ...(index < all.length - 1 ? [{ value: "\n", whitespace: true }] : []),
    ]);
  }

  return text.split(/(\s+)/).map((value) => ({ value, whitespace: /^\s+$/.test(value) }));
}
