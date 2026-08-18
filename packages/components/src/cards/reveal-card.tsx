"use client";

import { usePointerCapability } from "@pinky-ui/primitives";
import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type RevealCardProps = {
  /** Fills the frame edge-to-edge. */
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  mediaAspect?: "video" | "square" | "portrait";
  radius?: "md" | "lg" | "xl" | "2xl";
  shadow?: "neutral" | "pink";
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<RevealCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<RevealCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const ASPECT: Record<NonNullable<RevealCardProps["mediaAspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * Media fills the frame; title and description live in a caption that
 * slides up over it on hover instead of sitting below it. On a device with
 * no hover — checked via `usePointerCapability`, never a screen-width
 * guess — the caption is simply always visible, anchored to the bottom,
 * rather than trapped behind a hover that will never come. This is the
 * same fix this repo's Mask Reveal bug got: a hover-only reveal with no
 * pre-tap event is unreachable content on touch, not a lesser experience,
 * so the touch path isn't "tap to reveal" (a double-tap trap when the card
 * is also a link) — it's "reveal is already open."
 */
export function RevealCard({
  media,
  title,
  description,
  mediaAspect = "video",
  radius = "xl",
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  disabled = false,
}: RevealCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;
  const { hasHover } = usePointerCapability();

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "group relative isolate block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div
        className={cn(
          "w-full overflow-hidden bg-cloud-50",
          ASPECT[mediaAspect],
          "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
        )}
      >
        {media}
      </div>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 via-ink-900/60 to-transparent p-5 pt-10 text-milk",
          hasHover &&
            "translate-y-4 opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        )}
      >
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-milk/85">{description}</p> : null}
      </div>
    </Tag>
  );
}
