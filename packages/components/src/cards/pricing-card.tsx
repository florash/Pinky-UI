"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type PricingCardProps = {
  name: ReactNode;
  price: ReactNode;
  /** e.g. "/mo", "/seat/mo" — rendered right after `price`, not as its own line. */
  period?: ReactNode;
  description?: ReactNode;
  features?: ReactNode[];
  /** The call-to-action region — usually a button. Same word the rest of the family uses for "region below the content". */
  footer?: ReactNode;
  /** The recommended-plan treatment: a soft-pink surface and a badge. Reuses the family's pink accent, no new hue. */
  highlight?: boolean;
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

const RADIUS: Record<NonNullable<PricingCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<PricingCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="mt-0.5 size-3.5 shrink-0 text-ink-700" aria-hidden="true">
      <path d="M3 8.5 6.2 12 13 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Price + period + feature list + CTA, with an opt-in `highlight` state for
 * the recommended tier. `highlight` reuses the family's pink accent
 * (`--shadow-pink-*`, `blush-*`) rather than introducing a new hue — see
 * docs/card-api-conventions.md's `shadow` prop note. When the whole card is
 * clickable (`onClick`/`href`), it gets the standard focus-visible ring;
 * more often only the `footer` CTA button is the real target, so prefer
 * leaving the card itself non-clickable unless the whole tile genuinely
 * navigates somewhere (same call Basic Card's skill doc makes).
 */
export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  footer,
  highlight = false,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: PricingCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative block w-full overflow-hidden border text-left",
        highlight ? "border-blush-300 bg-blush-50/60" : "border-line bg-white/90",
        RADIUS[radius],
        SHADOW[highlight ? "pink" : shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[highlight ? "pink" : shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        {highlight ? (
          <span className="mb-3 inline-flex items-center rounded-pill bg-blush-200 px-2.5 py-1 text-xs font-semibold text-ink-900">
            Recommended
          </span>
        ) : null}
        <p className="font-display text-lg font-semibold tracking-tight text-ink-900">{name}</p>
        <p className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-3xl font-semibold tracking-tight text-ink-900 tabular-nums sm:text-4xl">{price}</span>
          {period ? <span className="text-sm text-ink-500">{period}</span> : null}
        </p>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
        {features && features.length > 0 ? (
          <ul className="mt-5 space-y-2.5">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </Tag>
  );
}
