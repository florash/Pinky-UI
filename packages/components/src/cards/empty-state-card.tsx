"use client";

import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type EmptyStateCardProps = {
  /** An illustration or icon, sized by the caller — this component doesn't ship any artwork of its own. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** The guidance CTA — usually a button. */
  action?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<EmptyStateCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<EmptyStateCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * Centered icon/illustration slot + title + description + guidance button.
 * `icon` is a bare slot, not a fixed-size chip — an illustration and a
 * small line icon want very different dimensions, so this component
 * doesn't impose one the way Notification Card's fixed icon chip does.
 */
export function EmptyStateCard({
  icon,
  title,
  description,
  action,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  className,
  surfaceClassName,
  disabled = false,
}: EmptyStateCardProps) {
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
      <div className={cn("flex flex-col items-center text-center", padded && "p-8 sm:p-10", surfaceClassName)}>
        {icon ? <div className="mb-4">{icon}</div> : null}
        <p className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</p>
        {description ? <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-700">{description}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
