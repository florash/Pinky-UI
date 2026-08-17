"use client";

import { Magnetic, type MagneticProps } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { CursorTarget, type CursorTargetProps } from "./cursor-provider";

export type MagneticCursorTargetProps = {
  children: ReactNode;
  /** Which layer responds: the cursor label, the target, or both. */
  influence?: "cursor" | "target" | "both";
  label?: CursorTargetProps["label"];
  variant?: CursorTargetProps["variant"];
  cursorScale?: CursorTargetProps["scale"];
  strength?: MagneticProps["strength"];
  range?: MagneticProps["range"];
  maxOffset?: MagneticProps["maxOffset"];
  preset?: MagneticProps["preset"];
  className?: string;
  disabled?: boolean;
};

/**
 * Composes the existing Magnetic primitive with CursorTarget. It adds no
 * second attraction algorithm: choose whether the semantic region influences
 * the follower, the target, or both.
 */
export function MagneticCursorTarget({
  children,
  influence = "both",
  label,
  variant,
  cursorScale = 1.45,
  strength = 0.28,
  range = 110,
  maxOffset = 7,
  preset = "snappy",
  className,
  disabled = false,
}: MagneticCursorTargetProps) {
  const target = (
    <CursorTarget
      label={influence === "target" ? undefined : label}
      variant={variant}
      scale={influence === "target" ? undefined : cursorScale}
      disabled={disabled}
      className={className}
    >
      {children}
    </CursorTarget>
  );

  if (influence === "cursor" || disabled) return target;

  return (
    <Magnetic
      strength={strength}
      range={range}
      maxOffset={maxOffset}
      preset={preset}
      disabled={disabled}
    >
      {target}
    </Magnetic>
  );
}
