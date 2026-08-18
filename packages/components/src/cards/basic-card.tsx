"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type BasicCardProps = {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  /** Renders as this element/component instead of a plain div — pass `Link` from next/link to make the whole card navigable. */
  as?: ElementType;
  /** Only meaningful when `as` renders an anchor (e.g. `as={Link}`). */
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<BasicCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<BasicCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * The card the rest of the family's structural half builds on: a title, an
 * optional description, an optional footer. No pointer effect of its own —
 * that's the point. See docs/card-api-conventions.md for the shared prop
 * shape (radius/padded/shadow/as/focus rule) every structural card follows.
 */
export function BasicCard({
  title,
  description,
  footer,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: BasicCardProps) {
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
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </Tag>
  );
}
