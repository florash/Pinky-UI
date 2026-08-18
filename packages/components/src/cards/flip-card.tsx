"use client";

import { usePointerCapability } from "@pinky-ui/primitives";
import { useState, type ElementType, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../utils/cn";

export type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  /** Aspect ratio of the flipping face — both front and back share it, so neither face jumps in height when it flips. */
  aspect?: "video" | "square" | "portrait";
  as?: ElementType;
  className?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<FlipCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<FlipCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

const ASPECT: Record<NonNullable<FlipCardProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * A 3D flip revealing a back face. Hover-driven on a device that has hover
 * (checked via `usePointerCapability`, not a screen-width guess); on
 * anything else it flips on tap/Enter/Space instead — a hover-only
 * `rotateY` would otherwise leave the back face permanently unreachable on
 * touch, the same class of bug the Tooltip and Mask Reveal fixes in this
 * repo already exist to prevent. The flip itself always runs (it's the
 * one thing the card exists to do), but `prefers-reduced-motion: reduce`
 * drops the tween to an instant swap via `motion-reduce:duration-0`
 * instead of skipping the state change.
 */
export function FlipCard({
  front,
  back,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  aspect = "square",
  as,
  className,
  disabled = false,
}: FlipCardProps) {
  const Tag = as ?? "div";
  const { hasHover } = usePointerCapability();
  const [flipped, setFlipped] = useState(false);

  const showBack = hasHover ? undefined : flipped;

  return (
    <Tag
      className={cn(
        "group block w-full text-left [perspective:1200px]",
        !hasHover && CLICKABLE_FOCUS,
        disabled && "pointer-events-none cursor-not-allowed opacity-60",
        className,
      )}
      tabIndex={hasHover || disabled ? undefined : 0}
      role={hasHover || disabled ? undefined : "button"}
      aria-pressed={hasHover || disabled ? undefined : flipped}
      onClick={hasHover || disabled ? undefined : () => setFlipped((value) => !value)}
      onKeyDown={
        hasHover || disabled
          ? undefined
          : (event: KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFlipped((value) => !value);
              }
            }
      }
    >
      <div
        className={cn(
          "relative w-full [transform-style:preserve-3d] transition-transform duration-500 ease-[var(--ease-soft)] motion-reduce:duration-0",
          ASPECT[aspect],
          hasHover && "group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]",
          showBack && "[transform:rotateY(180deg)]",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-hidden border border-line bg-white/90 [backface-visibility:hidden]",
            RADIUS[radius],
            SHADOW[shadow],
          )}
        >
          <div className={cn("h-full", padded && "p-6 sm:p-7")}>{front}</div>
        </div>
        <div
          className={cn(
            "absolute inset-0 overflow-hidden border border-line bg-white/90 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            RADIUS[radius],
            SHADOW[shadow],
          )}
        >
          <div className={cn("h-full", padded && "p-6 sm:p-7")}>{back}</div>
        </div>
      </div>
    </Tag>
  );
}
