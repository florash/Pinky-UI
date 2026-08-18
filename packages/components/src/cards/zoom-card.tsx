"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type ZoomCardProps = {
  /** Fills the frame edge-to-edge — an <img>, a video, any block-level media. */
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** How much the media scales on hover. Pinky keeps this subtle — past ~1.15 the crop starts looking like a mistake. */
  zoom?: number;
  mediaAspect?: "video" | "square" | "portrait";
  padded?: boolean;
  radius?: "md" | "lg" | "xl" | "2xl";
  shadow?: "neutral" | "pink";
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<ZoomCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<ZoomCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const ASPECT: Record<NonNullable<ZoomCardProps["mediaAspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * Media Card's sibling with one difference: the media scales up inside its
 * own clipped frame on hover instead of sitting still. The frame's
 * `overflow-hidden` is load-bearing — it's what turns "the image gets
 * bigger" into "the image zooms in," the crop is the whole effect. Scale is
 * `motion-safe:` only, so `prefers-reduced-motion: reduce` gets a normal
 * Media Card with no animation, never a half-scaled frame.
 */
export function ZoomCard({
  media,
  title,
  description,
  zoom = 1.08,
  mediaAspect = "video",
  padded = true,
  radius = "xl",
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: ZoomCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "group block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn("w-full overflow-hidden bg-cloud-50", ASPECT[mediaAspect])}>
        <div
          className={cn(
            "size-full",
            "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
            "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[var(--ease-soft)]",
            "motion-safe:group-hover:[transform:scale(var(--pinky-zoom))]",
          )}
          style={{ "--pinky-zoom": zoom } as CSSProperties}
        >
          {media}
        </div>
      </div>
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
      </div>
    </Tag>
  );
}
