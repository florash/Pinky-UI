"use client";

import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type NotificationCardVariant = "info" | "success" | "warning" | "error";

export type NotificationCardProps = {
  variant?: NotificationCardVariant;
  /** Overrides the variant's default icon. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Renders a close button when given; the card has no dismissed/hidden state of its own, this is just the callback. */
  onDismiss?: () => void;
  actions?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<NotificationCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<NotificationCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * Four semantic states, three hues in the palette (warm white / soft pink /
 * milk blue — no new hue, see docs/card-api-conventions.md). Pink and blue
 * alone can't carry four distinct meanings, so hue is only ever a secondary
 * signal here; the primary signal is always the icon's shape, and — because
 * warning and error are the pair that would otherwise collide (both being
 * the "something needs attention" hues, both naturally reaching for the
 * one warm accent this palette has) — border weight is the deciding third
 * signal between exactly those two: warning gets a hairline border, error
 * a visibly heavier one, on top of already-different icons. info/success
 * don't have this problem — they map to the cool/neutral side of the
 * palette, which was never contested.
 */
const VARIANT: Record<
  NotificationCardVariant,
  { chipBg: string; iconColor: string; border: string; icon: ReactNode }
> = {
  info: {
    chipBg: "bg-cloud-100",
    iconColor: "text-ink-700",
    border: "border-line",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 9v4.5M10 6.75v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  success: {
    chipBg: "bg-cloud-50",
    iconColor: "text-ink-700",
    border: "border-line",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.75 10.25 8.9 12.5l4.35-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    chipBg: "bg-blush-50",
    iconColor: "text-ink-700",
    border: "border-line",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
        <path d="M10 3.5 17.5 16h-15L10 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8.5v3.25M10 14.25v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  error: {
    chipBg: "bg-blush-100",
    iconColor: "text-ink-900",
    border: "border-2 border-blush-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

function DismissButton({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss"
      className="-m-1.5 shrink-0 rounded-full p-1.5 text-ink-500 transition-colors duration-200 ease-[var(--ease-soft)] hover:bg-ink-900/5 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
        <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * Icon + title + description + optional close button + optional actions.
 * See the VARIANT table above for how the four semantic states stay
 * distinguishable within a three-hue palette.
 */
export function NotificationCard({
  variant = "info",
  icon,
  title,
  description,
  onDismiss,
  actions,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  className,
  surfaceClassName,
  disabled = false,
}: NotificationCardProps) {
  const v = VARIANT[variant];

  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      className={cn(
        "block w-full overflow-hidden border bg-white/90",
        v.border,
        RADIUS[radius],
        SHADOW[shadow],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn(padded && "p-5 sm:p-6", surfaceClassName)}>
        <div className="flex items-start gap-3">
          <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", v.chipBg, v.iconColor)}>
            {icon ?? v.icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-display text-base font-semibold tracking-tight text-ink-900">{title}</p>
            {description ? <p className="mt-1 text-sm leading-relaxed text-ink-700">{description}</p> : null}
            {actions ? <div className="mt-3">{actions}</div> : null}
          </div>
          {onDismiss ? <DismissButton onDismiss={onDismiss} /> : null}
        </div>
      </div>
    </div>
  );
}
