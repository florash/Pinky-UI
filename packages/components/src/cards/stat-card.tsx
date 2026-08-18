"use client";

import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type StatCardTrend = {
  direction: "up" | "down" | "flat";
  /** e.g. "12.4% this week" — the arrow is never the only signal, this text always renders beside it. */
  label: string;
};

export type StatCardProps = {
  label: ReactNode;
  /** The headline number. Rendered with tabular figures so it doesn't reflow as it updates. */
  value: ReactNode;
  trend?: StatCardTrend;
  description?: ReactNode;
  /** A mini trend-chart slot — this component doesn't draw one itself, pass any small SVG/canvas element. */
  chart?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<StatCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<StatCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * Direction is carried by the arrow's geometry and by `label`'s own text —
 * never by colour alone, so the card reads the same for colour-blind users.
 * `flat` renders a horizontal dash rather than reusing the up or down glyph
 * at a diagonal, so it isn't mistaken for a shallow trend in either direction.
 */
function TrendGlyph({ direction }: { direction: StatCardTrend["direction"] }) {
  if (direction === "flat") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
        <path d="M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-3.5", direction === "down" && "rotate-180")} aria-hidden="true">
      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Big number + label + optional trend + optional mini-chart slot. See
 * docs/card-api-conventions.md — purely structural, no `as`/`href`: a stat
 * is something a page shows, not something it navigates from.
 */
export function StatCard({
  label,
  value,
  trend,
  description,
  chart,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  className,
  surfaceClassName,
  disabled = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "block w-full overflow-hidden border border-line bg-white/90",
        RADIUS[radius],
        SHADOW[shadow],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        <p className="text-sm font-medium text-ink-700">{label}</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="font-display text-3xl font-semibold tracking-tight text-ink-900 tabular-nums sm:text-4xl">{value}</p>
          {chart ? <div className="mb-1 shrink-0">{chart}</div> : null}
        </div>
        {trend ? (
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink-700">
            <TrendGlyph direction={trend.direction} />
            {trend.label}
          </p>
        ) : null}
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-700">{description}</p> : null}
      </div>
    </div>
  );
}
