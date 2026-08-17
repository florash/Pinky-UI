"use client";

import { CursorSpotlight } from "@pinky-ui/effects";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type InteractiveGradientProps = {
  children?: ReactNode;
  radius?: number;
  intensity?: number;
  tint?: string;
  base?: string;
  mode?: "container" | "viewport";
  className?: string;
  disabled?: boolean;
};

/** A background-oriented composition of the shared CursorSpotlight system. */
export function InteractiveGradient({
  children,
  radius = 520,
  intensity = 0.2,
  tint = "var(--color-blush-200)",
  base = "linear-gradient(135deg, var(--color-milk), var(--color-cloud-50))",
  mode = "container",
  className,
  disabled = false,
}: InteractiveGradientProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: base }}>
      <CursorSpotlight
        mode={mode}
        radius={radius}
        intensity={intensity}
        tint={tint}
        overlay
        disabled={disabled}
        className="h-full"
      >
        <div className="relative z-10">{children}</div>
      </CursorSpotlight>
    </div>
  );
}
