"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type HorizontalCardProps = {
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Width of the media column at the row breakpoint. */
  mediaWidth?: "sm" | "md" | "lg";
  /** Stacks to media-on-top below this breakpoint; row above it. */
  stackBelow?: "sm" | "md";
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<HorizontalCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<HorizontalCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const MEDIA_WIDTH: Record<NonNullable<HorizontalCardProps["mediaWidth"]>, string> = {
  sm: "sm:w-32",
  md: "sm:w-48",
  lg: "sm:w-64",
};

const STACK: Record<NonNullable<HorizontalCardProps["stackBelow"]>, { row: string; media: string }> = {
  sm: { row: "sm:flex-row", media: "sm:aspect-square" },
  md: { row: "md:flex-row", media: "md:aspect-square" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * Left media, right text — above `stackBelow`. Below it, media stacks on
 * top of a full-width content block, because a narrow column squeezed next
 * to text is where this layout actually breaks (the mobile nav panel this
 * session fixed was exactly a "compressed into a column that's too narrow
 * for its content" failure — same shape, different component).
 */
export function HorizontalCard({
  media,
  title,
  description,
  footer,
  mediaWidth = "md",
  stackBelow = "sm",
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: HorizontalCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;
  const stack = STACK[stackBelow];

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
      <div className={cn("flex flex-col", stack.row)}>
        <div
          className={cn(
            "aspect-video w-full shrink-0 overflow-hidden bg-cloud-50",
            stack.media,
            MEDIA_WIDTH[mediaWidth],
            "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
          )}
        >
          {media}
        </div>
        <div className={cn("min-w-0 flex-1", padded && "p-6 sm:p-7", surfaceClassName)}>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
          {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
          {footer ? <div className="mt-5">{footer}</div> : null}
        </div>
      </div>
    </Tag>
  );
}
