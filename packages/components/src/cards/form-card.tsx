"use client";

import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type FormCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  /** The field area. Plain children, same as every other structural card's body — see docs/card-api-conventions.md's "Slots" section. */
  children: ReactNode;
  /** The action region below the fields — usually a submit button, sometimes a cancel/submit pair. */
  footer?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<FormCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<FormCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * A form's visual container — title/description, a field area, an action
 * footer. Deliberately renders a plain `<div>`, never a `<form>`: the
 * caller owns the real `<form>` element (or doesn't have one, for a
 * dialog that submits some other way), so this component never risks a
 * nested-form conflict when it's composed inside a page that already has
 * one, the same class of bug this repo's nested-anchor/nested-form audit
 * exists to prevent.
 */
export function FormCard({
  title,
  description,
  children,
  footer,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  className,
  surfaceClassName,
  disabled = false,
}: FormCardProps) {
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
        {title || description ? (
          <div className="mb-5">
            {title ? <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3> : null}
            {description ? <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{description}</p> : null}
          </div>
        ) : null}
        <div className="space-y-4">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
