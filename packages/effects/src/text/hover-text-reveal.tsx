"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { useState, type ElementType, type ReactNode } from "react";

export type HoverTextRevealProps = {
  children?: ReactNode;
  text?: ReactNode;
  secondary?: ReactNode;
  hoverText?: ReactNode;
  as?: ElementType;
  className?: string;
  duration?: number;
  disabled?: boolean;
};

/** A legible label that swaps to a secondary phrase on hover or focus. */
export function HoverTextReveal({
  children,
  text,
  secondary,
  hoverText,
  as: Tag = "span",
  className,
  duration = 180,
  disabled = false,
}: HoverTextRevealProps) {
  const [active, setActive] = useState(false);
  const motionEnabled = useMotionEnabled();
  const primary = text ?? children;
  const alternate = hoverText ?? secondary;
  const showAlternate = !disabled && active && alternate !== undefined;

  return (
    <Tag
      className={className}
      tabIndex={Tag === "span" ? 0 : undefined}
      aria-label={typeof primary === "string" ? primary : undefined}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <span
        aria-hidden={showAlternate}
        style={{
          display: "inline-block",
          transition: `opacity ${motionEnabled && !disabled ? duration : 0}ms ease, transform ${motionEnabled && !disabled ? duration : 0}ms ease`,
          opacity: showAlternate ? 0 : 1,
          transform: showAlternate ? "translateY(-0.45em)" : "translateY(0)",
        }}
      >
        {primary}
      </span>
      {alternate !== undefined ? (
        <span
          aria-hidden={!showAlternate}
          style={{
            position: "absolute",
            inset: 0,
            display: "inline-flex",
            alignItems: "center",
            transition: `opacity ${motionEnabled && !disabled ? duration : 0}ms ease, transform ${motionEnabled && !disabled ? duration : 0}ms ease`,
            opacity: showAlternate ? 1 : 0,
            transform: showAlternate ? "translateY(0)" : "translateY(0.45em)",
          }}
        >
          {alternate}
        </span>
      ) : null}
    </Tag>
  );
}
