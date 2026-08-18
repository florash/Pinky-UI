"use client";

import { GridReveal } from "@pinky-ui/primitives";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../utils/cn";

export type ExpandCardProps = {
  title: ReactNode;
  /** Always visible, above the expand toggle. */
  summary?: ReactNode;
  /** Revealed when expanded. */
  children: ReactNode;
  /** Controlled open state. Omit to let the card manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<ExpandCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<ExpandCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * A card that discloses more of itself on click — not hover, click, the
 * same distinction Notification Card's variants get from icon shape: an
 * expand affordance has to work identically with a mouse, a keyboard and a
 * finger, so it was never a hover-effect candidate. Built directly on
 * `GridReveal` (`grid-template-rows: 0fr → 1fr`), the primitive this repo's
 * layout-animation audit produced specifically for this shape, rather than
 * a JS-measured height animation.
 */
export function ExpandCard({
  title,
  summary,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  className,
  disabled = false,
}: ExpandCardProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const contentId = useId();

  const toggle = () => {
    if (disabled) return;
    const next = !open;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

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
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "flex w-full items-start justify-between gap-4 text-left",
          padded && "p-6 sm:p-7",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-inset",
        )}
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
          {summary ? <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{summary}</p> : null}
        </div>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={cn(
            "mt-1 size-4 shrink-0 text-ink-500 transition-transform duration-300 ease-[var(--ease-soft)]",
            open && "rotate-180",
          )}
        >
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <GridReveal open={open} contentProps={{ id: contentId }}>
        <div className={cn(padded && "px-6 pb-6 sm:px-7 sm:pb-7")}>{children}</div>
      </GridReveal>
    </div>
  );
}
