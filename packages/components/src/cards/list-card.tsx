"use client";

import type { ElementType, Key, ReactNode } from "react";

import { cn } from "../utils/cn";

export type ListCardItem = {
  id: Key;
  content: ReactNode;
};

export type ListCardProps = {
  title?: ReactNode;
  items: ListCardItem[];
  footer?: ReactNode;
  /** Renders an empty-state message instead of the list when `items` is empty. */
  emptyMessage?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  as?: ElementType;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<ListCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<ListCardProps["shadow"]>, string> = {
  neutral: "shadow-soft",
  pink: "shadow-pink-soft",
};

/**
 * A card whose body is a divided list rather than prose — settings rows,
 * a short activity feed, anything that's naturally items rather than a
 * paragraph. Not clickable as a whole (see docs/card-api-conventions.md —
 * a purely structural container doesn't need the family's focus rule);
 * individual rows own whatever interactivity they have, same as
 * `ExpandableListRow` in packages/systems does for its one row instead of
 * a whole list.
 */
export function ListCard({
  title,
  items,
  footer,
  emptyMessage = "Nothing here yet.",
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  className,
  surfaceClassName,
  disabled = false,
}: ListCardProps) {
  const Tag = as ?? "div";

  return (
    <Tag
      className={cn(
        "block w-full overflow-hidden border border-line bg-white/90",
        RADIUS[radius],
        SHADOW[shadow],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {title ? (
        <div className={cn(padded && "px-6 pt-6 sm:px-7 sm:pt-7", "pb-3")}>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        </div>
      ) : null}
      {items.length > 0 ? (
        <ul className={cn(!title && padded && "mt-1", surfaceClassName)}>
          {items.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                padded && "px-6 sm:px-7",
                "py-4 text-sm leading-relaxed text-ink-700",
                index > 0 && "border-t border-line/70",
              )}
            >
              {item.content}
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn(padded && "px-6 sm:px-7", title ? "pb-6 sm:pb-7" : "py-6 sm:py-7", "text-sm text-ink-500")}>
          {emptyMessage}
        </p>
      )}
      {footer ? <div className={cn(padded && "px-6 sm:px-7", "pb-6 sm:pb-7 pt-3")}>{footer}</div> : null}
    </Tag>
  );
}
