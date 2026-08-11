"use client";

import { Magnetic } from "@pinky/primitives";
import { CursorSpotlight } from "@pinky/effects";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type HeroAction = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
};

export type MagneticCtaHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  background?: ReactNode;
  spotlight?: boolean;
  className?: string;
  disabled?: boolean;
};

/** A production-oriented hero with one tactile primary action. */
export function MagneticCtaHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  background,
  spotlight = true,
  className,
  disabled = false,
}: MagneticCtaHeroProps) {
  const content = (
    <section className={cn("relative isolate overflow-hidden", className)}>
      {background ? <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">{background}</div> : null}
      <div>
        {eyebrow ? <div>{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <div>{description}</div> : null}
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic strength={0.24} range={110} maxOffset={7} disabled={disabled}>
            {primaryAction.href ? (
              <a href={primaryAction.href} onClick={primaryAction.onClick} className="inline-flex rounded-[999px] bg-[color:var(--color-ink-900,#252933)] px-5 py-3 text-[color:var(--color-milk,#fcfbf8)]">
                {primaryAction.label}
              </a>
            ) : (
              <button type="button" onClick={primaryAction.onClick} className="rounded-[999px] bg-[color:var(--color-ink-900,#252933)] px-5 py-3 text-[color:var(--color-milk,#fcfbf8)]">
                {primaryAction.label}
              </button>
            )}
          </Magnetic>
          {secondaryAction ? (
            secondaryAction.href ? (
              <a href={secondaryAction.href} onClick={secondaryAction.onClick} className="px-4 py-3 text-sm">
                {secondaryAction.label}
              </a>
            ) : (
              <button type="button" onClick={secondaryAction.onClick} className="px-4 py-3 text-sm">
                {secondaryAction.label}
              </button>
            )
          ) : null}
        </div>
      </div>
    </section>
  );

  if (!spotlight) return content;
  return (
    <CursorSpotlight radius={460} intensity={0.2} tint="var(--color-blush-200)" disabled={disabled} className="rounded-[inherit]">
      {content}
    </CursorSpotlight>
  );
}
