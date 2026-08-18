"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type MediaCardProps = {
  /** Fills the top slot edge-to-edge — an <img>, a video, any block-level media. */
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Aspect ratio of the media slot. */
  mediaAspect?: "video" | "square" | "portrait";
  /** Applies to the text content block below the media, which is always edge-to-edge on its own. */
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

const RADIUS: Record<NonNullable<MediaCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<MediaCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const ASPECT: Record<NonNullable<MediaCardProps["mediaAspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * Media always fills its slot edge-to-edge — `padded` (see
 * docs/card-api-conventions.md) only ever applies to the text content
 * below it, never the media itself. `overflow-hidden` on the outer element
 * is what keeps the media's square corners from poking past the card's own
 * radius.
 */
export function MediaCard({
  media,
  title,
  description,
  footer,
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
}: MediaCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn("w-full overflow-hidden bg-cloud-50", ASPECT[mediaAspect], "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover")}>
        {media}
      </div>
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </Tag>
  );
}
